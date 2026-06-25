import { Component, OnInit } from '@angular/core';
import { HousingService, CreateOrUpdateHousing, HousingDto, BlockDto, CreateOrUpdateBlock } from '@proxy/housings';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-apartments-list',
  templateUrl: './apartments-list.component.html',
  styleUrls: ['./apartments-list.component.scss'],
})
export class ApartmentsListComponent implements OnInit {
  apartmanlar: HousingDto[] = [];
  loading = false;
  showModal = false;
  seciliApartman: HousingDto | null = null;
  validationHata = '';
  form: Partial<CreateOrUpdateHousing> = {};

  // Blok yönetimi
  showBlokPanel = false;
  blokPanelApartman: HousingDto | null = null;
  bloklar: BlockDto[] = [];
  blokYukleniyor = false;
  yeniBlokAdi = '';
  blokEkleniyor = false;
  blokHata = '';

  readonly TIPLER = ['Site', 'Apartman', 'Rezidans', 'Villa'];

  constructor(private housingService: HousingService) {}

  async ngOnInit(): Promise<void> {
    await this.verileriYukle();
  }

  async verileriYukle() {
    this.loading = true;
    try {
      this.apartmanlar = await firstValueFrom(this.housingService.getList());
    } catch (err) {
      console.error('Veriler yuklenirken hata:', err);
    } finally {
      this.loading = false;
    }
  }

  yeniApartman() {
    this.seciliApartman = null;
    this.validationHata = '';
    this.form = { isDelayCompensation: false, delayCompensationRate: 0, lastPaymentDay: 10, type: 'Apartman' };
    this.showModal = true;
  }

  duzenle(apartman: HousingDto) {
    this.seciliApartman = apartman;
    this.validationHata = '';
    this.form = { ...apartman };
    this.showModal = true;
  }

  async kaydet() {
    this.validationHata = '';
    if (!this.form.name?.trim()) { this.validationHata = 'Apartman adı zorunludur.'; return; }
    if (!this.form.city?.trim()) { this.validationHata = 'Şehir zorunludur.'; return; }
    try {
      const prop: CreateOrUpdateHousing = {
        name: this.form.name!,
        city: this.form.city!,
        town: this.form.town || '',
        adress: this.form.adress || '',
        postalCode: this.form.postalCode || '',
        email: this.form.email || '',
        phone: this.form.phone || '',
        type: this.form.type || 'Apartman',
        isDelayCompensation: this.form.isDelayCompensation ?? false,
        delayCompensationRate: this.form.delayCompensationRate ?? 0,
        lastPaymentDay: this.form.lastPaymentDay ?? 10,
      };
      if (this.seciliApartman?.id) {
        await firstValueFrom(this.housingService.updateHousing(this.seciliApartman.id!, prop));
      } else {
        await firstValueFrom(this.housingService.createHousing(prop));
      }
      this.showModal = false;
      await this.verileriYukle();
    } catch (err) {
      console.error('Kaydetme hatasi:', err);
      this.validationHata = 'Kaydetme sırasında bir hata oluştu.';
    }
  }

  async sil(id: string) {
    if (!confirm('Bu apartmanı silmek istediğinize emin misiniz?')) return;
    try {
      await firstValueFrom(this.housingService.delete(id));
      await this.verileriYukle();
    } catch (err) {
      console.error('Silme hatasi:', err);
    }
  }

  async aktifYap(id: string) {
    try {
      await firstValueFrom(this.housingService.changeHousing(id));
      await this.verileriYukle();
    } catch (err) {
      console.error('Aktif yapma hatasi:', err);
    }
  }

  // ---- Blok Yönetimi ----

  async bloklariGoster(apartman: HousingDto) {
    this.blokPanelApartman = apartman;
    this.showBlokPanel = true;
    this.yeniBlokAdi = '';
    this.blokHata = '';
    await this.bloklariYukle(apartman.id!);
  }

  async bloklariYukle(housingId: string) {
    this.blokYukleniyor = true;
    try {
      // Önce bu housing'i aktif yap, sonra blokları çek
      await firstValueFrom(this.housingService.changeHousing(housingId));
      this.bloklar = await firstValueFrom(this.housingService.getBlockList());
    } catch (err) {
      console.error('Bloklar yuklenirken hata:', err);
    } finally {
      this.blokYukleniyor = false;
    }
  }

  async blokEkle() {
    this.blokHata = '';
    if (!this.yeniBlokAdi.trim()) { this.blokHata = 'Blok adı boş olamaz.'; return; }
    this.blokEkleniyor = true;
    try {
      const prop: CreateOrUpdateBlock = { blockName: this.yeniBlokAdi.trim() };
      await firstValueFrom(this.housingService.createBlock(prop));
      this.yeniBlokAdi = '';
      await this.bloklariYukle(this.blokPanelApartman!.id!);
    } catch (err) {
      console.error('Blok ekleme hatasi:', err);
      this.blokHata = 'Blok eklenirken hata oluştu.';
    } finally {
      this.blokEkleniyor = false;
    }
  }

  async blokSil(blokId: string) {
    if (!confirm('Bu bloğu silmek istediğinize emin misiniz?')) return;
    try {
      await firstValueFrom(this.housingService.deleteBlockById(blokId));
      await this.bloklariYukle(this.blokPanelApartman!.id!);
    } catch (err) {
      console.error('Blok silme hatasi:', err);
    }
  }

  blokPanelKapat() {
    this.showBlokPanel = false;
    this.blokPanelApartman = null;
    this.bloklar = [];
  }
}
