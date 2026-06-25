import { Component, OnInit } from '@angular/core';
import { FloorResidentService, FloorResidentDto, CreateOrUpdateFloorResident, FloorResidentExtract } from '@proxy/floor-residents';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-floor-resident-list',
  templateUrl: './floor-resident-list.component.html',
  styleUrls: ['./floor-resident-list.component.scss']
})
export class FloorResidentListComponent implements OnInit {

  sakinler: FloorResidentDto[] = [];
  filteredSakinler: FloorResidentDto[] = [];

  aramaMetni: string = '';
  secilenDurum: string = '';

  showModal: boolean = false;
  seciliSakin: FloorResidentDto | null = null;
  silmeOnayModal: boolean = false;
  silinecekId: string | null = null;

  form: Partial<CreateOrUpdateFloorResident> = {};

  // Ekstre
  ekstreModal: boolean = false;
  seciliEkstreSakin: FloorResidentDto | null = null;
  ekstreVerisi: FloorResidentExtract[] = [];
  ekstreYukleniyor: boolean = false;

  loading: boolean = false;

  constructor(private floorResidentService: FloorResidentService) { }

  async ngOnInit(): Promise<void> {
    await this.verileriYukle();
  }

  async verileriYukle() {
    this.loading = true;
    try {
      this.sakinler = await firstValueFrom(this.floorResidentService.getFloorResidentList());
      this.filtrele();
    } catch (err) {
      console.error('Sakinler yüklenirken hata oluştu:', err);
    } finally {
      this.loading = false;
    }
  }

  filtrele() {
    this.filteredSakinler = this.sakinler.filter(s => {
      const aramaUyumu = !this.aramaMetni ||
        (s.name || '').toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (s.surname || '').toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (s.phone || '').includes(this.aramaMetni) ||
        (s.email || '').toLowerCase().includes(this.aramaMetni.toLowerCase());

      const durumUyumu = !this.secilenDurum ||
        (this.secilenDurum === 'Aktif' && s.isActive) ||
        (this.secilenDurum === 'Pasif' && !s.isActive);

      return aramaUyumu && durumUyumu;
    });
  }

  yeniSakinEkle() {
    this.seciliSakin = null;
    this.form = { isActive: true };
    this.showModal = true;
  }

  duzenle(sakin: FloorResidentDto) {
    this.seciliSakin = sakin;
    this.form = { ...sakin };
    this.showModal = true;
  }

  async kaydet() {
    try {
      const prop: CreateOrUpdateFloorResident = {
        name: this.form.name || '',
        surname: this.form.surname || '',
        phone: this.form.phone || '',
        email: this.form.email || '',
        identity: this.form.identity || '',
        isActive: this.form.isActive ?? true,
      };

      if (this.seciliSakin && this.seciliSakin.id) {
        await firstValueFrom(this.floorResidentService.updateFloorResident(this.seciliSakin.id, prop));
      } else {
        await firstValueFrom(this.floorResidentService.createFloorResident(prop));
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

  async silOnay() {
    if (!this.silinecekId) return;
    try {
      await firstValueFrom(this.floorResidentService.deleteFloorResident(this.silinecekId));
      this.silmeOnayModal = false;
      await this.verileriYukle();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  }

  toplamAktif() { return this.sakinler.filter(s => s.isActive).length; }
  toplamPasif() { return this.sakinler.filter(s => !s.isActive).length; }

  async ekstreGoster(sakin: FloorResidentDto) {
    this.seciliEkstreSakin = sakin;
    this.ekstreVerisi = [];
    this.ekstreYukleniyor = true;
    this.ekstreModal = true;
    try {
      const extract = await firstValueFrom(this.floorResidentService.getExtractByFloorResidentId(sakin.id!));
      this.ekstreVerisi = Array.isArray(extract) ? extract : [extract];
    } catch (err) {
      console.error('Ekstre yüklenirken hata oluştu:', err);
    } finally {
      this.ekstreYukleniyor = false;
    }
  }

  ekstreToplam(alan: keyof FloorResidentExtract): number {
    return this.ekstreVerisi.reduce((t, e) => t + ((e[alan] as number) || 0), 0);
  }

  whatsappGonder(sakin: FloorResidentDto, mesaj?: string) {
    if (!sakin.phone) return;
    const telefon = sakin.phone.replace(/\s/g, '').replace(/^0/, '90');
    const varsayilanMesaj = mesaj || `Sayın ${sakin.name} ${sakin.surname}, Apartio yönetiminden bilgilendirme mesajıdır.`;
    const url = `https://wa.me/${telefon}?text=${encodeURIComponent(varsayilanMesaj)}`;
    window.open(url, '_blank');
  }

  smsGonder(sakin: FloorResidentDto, mesaj?: string) {
    if (!sakin.phone) return;
    const telefon = sakin.phone.replace(/\s/g, '');
    const varsayilanMesaj = mesaj || `Sayın ${sakin.name} ${sakin.surname}, Apartio yönetiminden bilgilendirme mesajıdır.`;
    window.open(`sms:${telefon}?body=${encodeURIComponent(varsayilanMesaj)}`, '_self');
  }
}
