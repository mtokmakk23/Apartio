import { Component, OnInit } from '@angular/core';
import { TURKEY_CITIES, TurkeyCity } from '../turkey-cities';
import { HousingService, CreateOrUpdateHousing, HousingDto, BlockDto, CreateOrUpdateBlock, HousingType, HousingTypeDto } from '@proxy/housings';
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

  // Ek alanlar (QR için, backend'de yok)
  formVergiDairesi = '';
  formVergiNo = '';
  formSigortaNo = '';

  // QR modal
  showQrModal = false;
  qrApartman: HousingDto | null = null;
  qrVergiDairesi = '';
  qrVergiNo = '';
  qrSigortaNo = '';
  qrCanvas: HTMLCanvasElement | null = null;

  // Blok yönetimi
  showBlokPanel = false;
  blokPanelApartman: HousingDto | null = null;
  bloklar: BlockDto[] = [];
  blokYukleniyor = false;
  yeniBlokAdi = '';
  blokEkleniyor = false;
  blokHata = '';

  tipler: HousingTypeDto[] = [];
  readonly HousingType = HousingType;
  readonly TIPLER = [
    { value: HousingType.Apartman, label: 'Apartman' },
    { value: HousingType.Site, label: 'Site' },
    { value: HousingType.Daire, label: 'Daire' },
    { value: HousingType.Rezidans, label: 'Rezidans' },
    { value: HousingType.Villa, label: 'Villa' },
  ];
  readonly sehirler: TurkeyCity[] = TURKEY_CITIES;
  ilceler: string[] = [];

  constructor(private housingService: HousingService) {}

  sehirDegisti() {
    const secili = this.sehirler.find(s => s.il === this.form.city);
    this.ilceler = secili ? secili.ilceler : [];
    this.form.town = '';
  }

  ilceleriniYukle(city?: string) {
    if (!city) { this.ilceler = []; return; }
    const secili = this.sehirler.find(s => s.il === city);
    this.ilceler = secili ? secili.ilceler : [];
  }

  async ngOnInit(): Promise<void> {
    await this.verileriYukle();
  }

  async verileriYukle() {
    this.loading = true;
    try {
      const [apartmanlar, tipler] = await Promise.all([
        firstValueFrom(this.housingService.getList()),
        firstValueFrom(this.housingService.getHousingTypeList()).catch(() => [])
      ]);
      this.apartmanlar = apartmanlar;
      if (tipler && tipler.length > 0) {
        this.tipler = tipler;
      }
    } catch (err) {
      console.error('Veriler yuklenirken hata:', err);
    } finally {
      this.loading = false;
    }
  }

  getHousingTypeLabel(type?: number, typeName?: string): string {
    if (typeName) return typeName;
    const dynamic = this.tipler.find(t => t.id === type)?.name;
    if (dynamic) return dynamic;
    return this.TIPLER.find(t => t.value === type)?.label ?? '—';
  }

  yeniApartman() {
    this.seciliApartman = null;
    this.validationHata = '';
    this.formVergiDairesi = '';
    this.formVergiNo = '';
    this.formSigortaNo = '';
    this.form = { isDelayCompensation: false, delayCompensationRate: 0, type: HousingType.Apartman };
    this.showModal = true;
  }

  duzenle(apartman: HousingDto) {
    this.seciliApartman = apartman;
    this.validationHata = '';
    this.formVergiDairesi = (apartman as any).vergiDairesi || '';
    this.formVergiNo = (apartman as any).vergiNo || '';
    this.formSigortaNo = (apartman as any).sigortaNo || '';
    this.form = { ...apartman };
    this.ilceleriniYukle(apartman.city);
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
        type: this.form.type ?? HousingType.Apartman,
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

  // ---- QR Kod ----

  qrGoster(apartman: HousingDto) {
    this.qrApartman = apartman;
    this.qrVergiDairesi = (apartman as any).vergiDairesi || '';
    this.qrVergiNo = (apartman as any).vergiNo || '';
    this.qrSigortaNo = (apartman as any).sigortaNo || '';
    this.showQrModal = true;
    setTimeout(() => this.qrOlustur(), 100);
  }

  qrUrl = '';

  qrOlustur() {
    if (!this.qrApartman) return;
    const a = this.qrApartman;
    const bilgi = [
      'Apartman: ' + (a.name || ''),
      'Adres: ' + [a.adress, a.town, a.city].filter(Boolean).join(', '),
      'Vergi Dairesi: ' + this.qrVergiDairesi,
      'Vergi No: ' + this.qrVergiNo,
    ].filter(s => !s.endsWith(': ')).join('\n');

    const encoded = encodeURIComponent(bilgi);
    this.qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encoded;
  }

  qrIndir() {
    if (!this.qrUrl) return;
    const link = document.createElement('a');
    link.download = (this.qrApartman?.name || 'apartman') + '-qr.png';
    link.href = this.qrUrl;
    link.target = '_blank';
    link.click();
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
