import { Component, OnInit } from '@angular/core';
import { HousingService, BlockDto, UnitDto, CreateOrUpdateUnit } from '@proxy/housings';
import { FloorResidentService, FloorResidentDto } from '@proxy/floor-residents';
import { firstValueFrom } from 'rxjs';
import { UnitViewModel } from '../housing.model';

@Component({
  selector: 'app-housing-list',
  templateUrl: './housing-list.component.html',
  styleUrls: ['./housing-list.component.scss']
})
export class HousingListComponent implements OnInit {

  bloklar: BlockDto[] = [];
  units: UnitViewModel[] = [];
  filteredUnits: UnitViewModel[] = [];
  floorResidents: FloorResidentDto[] = [];

  readonly BIRIM_TIPLERI = [
    'Daire',
    'Dükkan',
    'Ofis',
    'Villa',
    'Dubleks',
    'Penthouse',
    'Stüdyo',
    'Depo'
  ];

  aramaMetni: string = '';
  secilenBlok: string = '';
  secilenTip: string = '';

  showModal: boolean = false;
  seciliUnit: UnitViewModel | null = null;
  silmeOnayModal: boolean = false;
  silinecekId: string | null = null;

  form: Partial<CreateOrUpdateUnit> = {};
  validationHatasi: string = '';
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
      // Blokları ve Sakinleri çek
      const [bloklar, residents] = await Promise.all([
        firstValueFrom(this.housingService.getBlockList()),
        firstValueFrom(this.floorResidentService.getFloorResidentList())
      ]);

      this.bloklar = bloklar;
      this.floorResidents = residents;

      // 3 Katmanlı sistem: Sitedeki tüm bağımsız bölümleri tek sorguda çek
      const unitList = await firstValueFrom(this.housingService.getUnitList());

      this.units = unitList.map(u => this.unitZenginlestir(u));
      this.filtrele();
    } catch (err) {
      console.error('Veriler yüklenirken hata oluştu:', err);
    } finally {
      this.loading = false;
    }
  }

  unitZenginlestir(unit: UnitDto): UnitViewModel {
    const sahip = this.floorResidents.find(f => f.id === unit.homeOwnerId);
    const kiraci = this.floorResidents.find(f => f.id === unit.hirerId);
    const blok = this.bloklar.find(b => b.id === unit.blockId);

    return {
      ...unit,
      unitNumber: unit.unitNumber || unit.circleName || '',
      unitType: unit.unitType || 'Daire',
      floor: unit.floor ?? 1,
      blockName: unit.blockName || blok?.blockName || '—',
      homeOwnerName: sahip ? `${sahip.name ?? ''} ${sahip.surname ?? ''}`.trim() : undefined,
      hirerName: kiraci ? `${kiraci.name ?? ''} ${kiraci.surname ?? ''}`.trim() : undefined,
    };
  }

  filtrele() {
    this.filteredUnits = this.units.filter(u => {
      const numara = u.unitNumber || u.circleName || '';
      const aramaUyumu = !this.aramaMetni ||
        numara.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (u.homeOwnerName || '').toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (u.hirerName || '').toLowerCase().includes(this.aramaMetni.toLowerCase());
      
      const blokUyumu = !this.secilenBlok || u.blockId === this.secilenBlok;
      const tipUyumu = !this.secilenTip || u.unitType === this.secilenTip;

      return aramaUyumu && blokUyumu && tipUyumu;
    });
  }

  yeniUnitEkle() {
    this.seciliUnit = null;
    this.form = {
      blockId: this.bloklar[0]?.id || '',
      unitType: 'Daire',
      floor: 1,
      grossSquareMeters: undefined,
      netSquareMeters: undefined
    };
    this.showModal = true;
  }

  duzenle(unit: UnitViewModel) {
    this.seciliUnit = unit;
    this.form = {
      blockId: unit.blockId,
      unitNumber: unit.unitNumber || unit.circleName,
      unitType: unit.unitType || 'Daire',
      floor: unit.floor ?? 1,
      grossSquareMeters: unit.grossSquareMeters,
      netSquareMeters: unit.netSquareMeters,
      homeOwnerId: unit.homeOwnerId,
      hirerId: unit.hirerId
    };
    this.showModal = true;
  }

  async kaydet() {
    this.validationHatasi = '';
    const unitNo = (this.form.unitNumber || this.form.circleName || '').trim();

    if (!unitNo) {
      this.validationHatasi = 'Bağımsız bölüm / kapı numarası zorunludur.';
      return;
    }
    if (!this.form.blockId) {
      this.validationHatasi = 'Blok seçimi zorunludur.';
      return;
    }

    try {
      const prop: CreateOrUpdateUnit = {
        blockId: this.form.blockId,
        unitNumber: unitNo,
        unitType: this.form.unitType || 'Daire',
        floor: Number(this.form.floor) || 1,
        grossSquareMeters: this.form.grossSquareMeters ? Number(this.form.grossSquareMeters) : undefined,
        netSquareMeters: this.form.netSquareMeters ? Number(this.form.netSquareMeters) : undefined,
        homeOwnerId: this.form.homeOwnerId || undefined,
        hirerId: this.form.hirerId || undefined,
      };

      if (this.seciliUnit && this.seciliUnit.id) {
        await firstValueFrom(this.housingService.updateUnit(this.seciliUnit.id, prop));
      } else {
        await firstValueFrom(this.housingService.createUnit(prop));
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
      await firstValueFrom(this.housingService.deleteUnit(this.silinecekId));
      this.silmeOnayModal = false;
      await this.verileriYukle();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  }

  blokAdi(blockId?: string): string {
    return this.bloklar.find(b => b.id === blockId)?.blockName || '—';
  }

  toplamBirim() { return this.units.length; }
  toplamSahipli() { return this.units.filter(u => !!u.homeOwnerId).length; }
  toplamKiracili() { return this.units.filter(u => !!u.hirerId).length; }
}
