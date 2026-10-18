import { Component, OnInit } from '@angular/core';
import { TURKEY_CITIES, TurkeyCity } from '../turkey-cities';
import { HousingService, CreateOrUpdateHousing, HousingDto, BlockDto, CreateOrUpdateBlock, HousingType, HousingTypeDto } from '@proxy/housings';
import { firstValueFrom } from 'rxjs';
import { EventService } from 'src/app/core/services/event.service';

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

  // Accordion & Blok Yönetimi
  acikSiteler: { [housingId: string]: boolean } = {};
  bloklarMap: { [housingId: string]: BlockDto[] } = {};
  blokYukleniyorMap: { [housingId: string]: boolean } = {};
  yeniBlokAdiMap: { [housingId: string]: string } = {};
  blokEkleniyorMap: { [housingId: string]: boolean } = {};
  blokHataMap: { [housingId: string]: string } = {};

  tipler: HousingTypeDto[] = [];
  readonly HousingType = HousingType;
  readonly TIPLER = [
    { value: HousingType.Site, label: 'Site' },
    { value: HousingType.Apartman, label: 'Apartman' },
    { value: HousingType.Rezidans, label: 'Rezidans' },
    { value: HousingType.VillaSitesi, label: 'Villa Sitesi' },
    { value: HousingType.MustakilEv, label: 'Müstakil Ev' },
    { value: HousingType.IsMerkezi, label: 'İş Merkezi / Plaza' },
  ];
  readonly sehirler: TurkeyCity[] = TURKEY_CITIES;
  ilceler: string[] = [];

  constructor(
    private housingService: HousingService,
    private eventService: EventService
  ) {}

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
      const [apartmanlar, tipler, secili] = await Promise.all([
        firstValueFrom(this.housingService.getList()),
        firstValueFrom(this.housingService.getHousingTypeList()).catch(() => []),
        firstValueFrom(this.housingService.getSelectedHousing()).catch(() => null),
      ]);
      this.apartmanlar = apartmanlar || [];
      if (tipler && tipler.length > 0) {
        this.tipler = tipler;
      }

      // Başlangıçta tüm sitelerin bloklarını ve sayılarını çek
      await this.tumSitelerinBloklariniYukle(secili?.id);
    } catch {
      // ignore
    } finally {
      this.loading = false;
    }
  }

  async tumSitelerinBloklariniYukle(aktifHousingId?: string) {
    for (const apt of this.apartmanlar) {
      if (!apt.id) continue;
      try {
        await firstValueFrom(this.housingService.changeHousing(apt.id));
        this.bloklarMap[apt.id] = await firstValueFrom(this.housingService.getBlockList());
      } catch {
        this.bloklarMap[apt.id] = [];
      }
    }
    // Kullanıcının orijinal aktif sitesini koru
    if (aktifHousingId) {
      await firstValueFrom(this.housingService.changeHousing(aktifHousingId)).catch(() => {});
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
    this.form = { isDelayCompensation: false, delayCompensationRate: 0, type: HousingType.Site };
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
    if (!this.form.name?.trim()) { this.validationHata = 'Site / Tesis adı zorunludur.'; return; }
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
        type: this.form.type ?? HousingType.Site,
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
      this.eventService.broadcast('housingChanged');
      await this.verileriYukle();
    } catch {
      this.validationHata = 'Kaydetme sırasında bir hata oluştu.';
    }
  }

  async sil(id: string) {
    if (!confirm('Bu site / tesis kaydını silmek istediğinize emin misiniz?')) return;
    try {
      await firstValueFrom(this.housingService.delete(id));
      this.eventService.broadcast('housingChanged');
      await this.verileriYukle();
    } catch {
      // ignore
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

  // ---- Accordion & Blok Yönetimi ----

  async toggleBlokAccordion(apartman: HousingDto) {
    if (!apartman.id) return;
    const id = apartman.id;
    this.acikSiteler[id] = !this.acikSiteler[id];
    if (this.acikSiteler[id] && !this.bloklarMap[id]) {
      await this.siteBloklariniYukle(id);
    }
  }

  async siteBloklariniYukle(housingId: string) {
    this.blokYukleniyorMap[housingId] = true;
    this.blokHataMap[housingId] = '';
    try {
      await firstValueFrom(this.housingService.changeHousing(housingId));
      this.bloklarMap[housingId] = await firstValueFrom(this.housingService.getBlockList());
    } catch {
      this.blokHataMap[housingId] = 'Bloklar yüklenirken bir hata oluştu.';
    } finally {
      this.blokYukleniyorMap[housingId] = false;
    }
  }

  async blokEkle(housingId: string) {
    const blokAdi = (this.yeniBlokAdiMap[housingId] || '').trim();
    this.blokHataMap[housingId] = '';
    if (!blokAdi) {
      this.blokHataMap[housingId] = 'Blok adı boş olamaz.';
      return;
    }

    this.blokEkleniyorMap[housingId] = true;
    try {
      await firstValueFrom(this.housingService.changeHousing(housingId));
      const prop: CreateOrUpdateBlock = { blockName: blokAdi };
      await firstValueFrom(this.housingService.createBlock(prop));
      this.yeniBlokAdiMap[housingId] = '';
      this.bloklarMap[housingId] = await firstValueFrom(this.housingService.getBlockList());
    } catch {
      this.blokHataMap[housingId] = 'Blok eklenirken bir hata oluştu.';
    } finally {
      this.blokEkleniyorMap[housingId] = false;
    }
  }

  async blokSil(housingId: string, blokId: string) {
    if (!confirm('Bu bloğu silmek istediğinize emin misiniz?')) return;
    try {
      await firstValueFrom(this.housingService.deleteBlockById(blokId));
      await firstValueFrom(this.housingService.changeHousing(housingId));
      this.bloklarMap[housingId] = await firstValueFrom(this.housingService.getBlockList());
    } catch {
      // ignore
    }
  }
}
