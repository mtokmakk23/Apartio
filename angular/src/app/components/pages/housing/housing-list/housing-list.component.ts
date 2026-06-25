import { Component, OnInit } from '@angular/core';
import { HousingService, BlockDto, CircleDto } from '@proxy/housings';
import { FloorResidentService, FloorResidentDto } from '@proxy/floor-residents';
import { firstValueFrom } from 'rxjs';
import { CircleViewModel } from '../housing.model';

@Component({
  selector: 'app-housing-list',
  templateUrl: './housing-list.component.html',
  styleUrls: ['./housing-list.component.scss']
})
export class HousingListComponent implements OnInit {

  bloklar: BlockDto[] = [];
  circles: CircleViewModel[] = [];
  filteredCircles: CircleViewModel[] = [];
  floorResidents: FloorResidentDto[] = [];

  aramaMetni: string = '';
  secilenBlok: string = '';

  showModal: boolean = false;
  seciliCircle: CircleViewModel | null = null;
  silmeOnayModal: boolean = false;
  silinecekId: string | null = null;

  form: Partial<CircleDto> = {};

  loading: boolean = false;

  constructor(
    private housingService: HousingService,
    private floorResidentService: FloorResidentService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.verileriYukle();
  }

  async verileriYukle() {
    this.loading = true;
    try {
      // Önce blokları çek
      this.bloklar = await firstValueFrom(this.housingService.getBlockList());

      // Sakinleri çek (ev sahibi / kiracı isimlerini göstermek için)
      this.floorResidents = await firstValueFrom(this.floorResidentService.getFloorResidentList());

      // Her blok için daireleri (circle) çek ve birleştir
      let tumCircleler: CircleViewModel[] = [];
      for (const blok of this.bloklar) {
        if (!blok.id) continue;
        const circleList = await firstValueFrom(this.housingService.getCircleList(blok.id));
        const zenginlestirilmis = circleList.map(c => this.circleZenginlestir(c, blok));
        tumCircleler = tumCircleler.concat(zenginlestirilmis);
      }

      this.circles = tumCircleler;
      this.filtrele();
    } catch (err) {
      console.error('Veriler yüklenirken hata oluştu:', err);
    } finally {
      this.loading = false;
    }
  }

  circleZenginlestir(circle: CircleDto, blok?: BlockDto): CircleViewModel {
    const sahip = this.floorResidents.find(f => f.id === circle.homeOwnerId);
    const kiraci = this.floorResidents.find(f => f.id === circle.hirerId);
    return {
      ...circle,
      blockName: blok?.blockName,
      homeOwnerName: sahip ? `${sahip.name ?? ''} ${sahip.surname ?? ''}`.trim() : undefined,
      hirerName: kiraci ? `${kiraci.name ?? ''} ${kiraci.surname ?? ''}`.trim() : undefined,
    };
  }

  filtrele() {
    this.filteredCircles = this.circles.filter(c => {
      const aramaUyumu = !this.aramaMetni ||
        (c.circleName || '').toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (c.homeOwnerName || '').toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (c.hirerName || '').toLowerCase().includes(this.aramaMetni.toLowerCase());
      const blokUyumu = !this.secilenBlok || c.blockId === this.secilenBlok;
      return aramaUyumu && blokUyumu;
    });
  }

  yeniDaireEkle() {
    this.seciliCircle = null;
    this.form = { blockId: this.bloklar[0]?.id || '' };
    this.showModal = true;
  }

  duzenle(circle: CircleViewModel) {
    this.seciliCircle = circle;
    this.form = { ...circle };
    this.showModal = true;
  }

  validationHatasi: string = '';

  async kaydet() {
    // Validation
    this.validationHatasi = '';
    if (!this.form.circleName?.trim()) {
      this.validationHatasi = 'Daire adı zorunludur.';
      return;
    }
    if (!this.form.blockId) {
      this.validationHatasi = 'Blok seçimi zorunludur.';
      return;
    }

    try {
      const prop = {
        blockId: this.form.blockId,
        circleName: this.form.circleName,
        homeOwnerId: this.form.homeOwnerId || undefined,
        hirerId: this.form.hirerId || undefined,
      };

      if (this.seciliCircle && this.seciliCircle.id) {
        await firstValueFrom(this.housingService.updateCircle(this.seciliCircle.id, prop));
      } else {
        await firstValueFrom(this.housingService.createCircle(prop));
      }

      this.showModal = false;
      await this.verileriYukle();
    } catch (err) {
      console.error('Kaydetme hatası:', err);
    }
  }

  silmeOnayla(id: string) {
    this.silinecekId = id;
    this.silmeOnayModal = true;
  }

  async silmeOnayla2() {
    if (!this.silinecekId) return;
    try {
      await firstValueFrom(this.housingService.deleteCircleById(this.silinecekId));
      this.silmeOnayModal = false;
      await this.verileriYukle();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  }

  blokAdi(blockId?: string): string {
    return this.bloklar.find(b => b.id === blockId)?.blockName || '—';
  }

  toplamDaire() { return this.circles.length; }
  toplamSahipli() { return this.circles.filter(c => !!c.homeOwnerId).length; }
  toplamKiracili() { return this.circles.filter(c => !!c.hirerId).length; }
}
