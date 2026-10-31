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
  apartments: HousingDto[] = [];
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
  bloksMap: { [housingId: string]: BlockDto[] } = {};
  blokYukleniyorMap: { [housingId: string]: boolean } = {};
  blokHataMap: { [housingId: string]: string } = {};

  // Block Modal (Add & Edit)
  showBlockModal = false;
  selectedBlockHousingId = '';
  selectedBlockId = '';
  blockForm: CreateOrUpdateBlock = {
    blockName: '',
    totalFloors: 1,
    elevatorCount: 0
  };
  blockFormError = '';
  isBlockSaving = false;

  tipler: HousingTypeDto[] = [];
  readonly HousingType = HousingType;
  readonly TYPES = [
    { value: HousingType.Site, label: 'Site' },
    { value: HousingType.Apartman, label: 'Apartman' },
    { value: HousingType.Rezidans, label: 'Rezidans' },
    { value: HousingType.VillaSitesi, label: 'Villa Sitesi' },
    { value: HousingType.MustakilEv, label: 'Müstakil Ev' },
    { value: HousingType.IsMerkezi, label: 'İş Merkezi / Plaza' },
  ];
  readonly cities: TurkeyCity[] = TURKEY_CITIES;
  districts: string[] = [];

  constructor(
    private housingService: HousingService,
    private eventService: EventService
  ) { }

  cityChanged() {
    const selected = this.cities.find(s => s.il === this.form.city);
    this.districts = selected ? selected.ilceler : [];
    this.form.town = '';
  }

  loadDistrict(city?: string) {
    if (!city) { this.districts = []; return; }
    const selected = this.cities.find(s => s.il === city);
    this.districts = selected ? selected.ilceler : [];
  }

  async ngOnInit(): Promise<void> {
    await this.verileriYukle();
  }

  async verileriYukle() {
    this.loading = true;
    try {
      const [apartmanlar, tipler] = await Promise.all([
        firstValueFrom(this.housingService.getList()),
        firstValueFrom(this.housingService.getHousingTypeList()).catch(() => []),
      ]);
      this.apartments = apartmanlar || [];
      if (tipler && tipler.length > 0) {
        this.tipler = tipler;
      }

      // Başlangıçta tüm sitelerin bloklarını tek seferde çek
      await this.getAllBlocks();
    } catch {
      // ignore
    } finally {
      this.loading = false;
    }
  }

  async getAllBlocks() {
    const housingIds = this.apartments
      .map(apt => apt.id)
      .filter((id): id is string => !!id);

    if (housingIds.length === 0) {
      this.bloksMap = {};
      return;
    }

    try {
      const allBlocks = await firstValueFrom(this.housingService.getBlockList({ housingIds }));
      const newMap: { [housingId: string]: BlockDto[] } = {};
      for (const apt of this.apartments) {
        if (apt.id) {
          newMap[apt.id] = [];
        }
      }
      for (const block of allBlocks || []) {
        if (block.housingId && newMap[block.housingId]) {
          newMap[block.housingId].push(block);
        }
      }
      this.bloksMap = newMap;
    } catch {
      const fallbackMap: { [housingId: string]: BlockDto[] } = {};
      for (const apt of this.apartments) {
        if (apt.id) {
          fallbackMap[apt.id] = [];
        }
      }
      this.bloksMap = fallbackMap;
    }
  }

  getHousingTypeLabel(type?: number, typeName?: string): string {
    if (typeName) return typeName;
    const dynamic = this.tipler.find(t => t.id === type)?.name;
    if (dynamic) return dynamic;
    return this.TYPES.find(t => t.value === type)?.label ?? '—';
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
    this.loadDistrict(apartman.city);
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
    if (this.acikSiteler[id] && !this.bloksMap[id]) {
      await this.siteBloklariniYukle(id);
    }
  }

  async siteBloklariniYukle(housingId: string) {
    this.blokYukleniyorMap[housingId] = true;
    this.blokHataMap[housingId] = '';
    try {
      this.bloksMap[housingId] = await firstValueFrom(this.housingService.getBlockList({ housingId }));
    } catch (err: any) {
      this.blokHataMap[housingId] = err.error?.error?.message || 'Bloklar yüklenirken bir hata oluştu.';
    } finally {
      this.blokYukleniyorMap[housingId] = false;
    }
  }

  openAddBlockModal(housingId: string) {
    this.selectedBlockHousingId = housingId;
    this.selectedBlockId = '';
    this.blockForm = {
      blockName: '',
      totalFloors: 1,
      elevatorCount: 0
    };
    this.blockFormError = '';
    this.showBlockModal = true;
  }

  openEditBlockModal(housingId: string, block: BlockDto) {
    this.selectedBlockHousingId = housingId;
    this.selectedBlockId = block.id || '';
    this.blockForm = {
      blockName: block.blockName || '',
      totalFloors: block.totalFloors ?? 1,
      elevatorCount: block.elevatorCount ?? 0
    };
    this.blockFormError = '';
    this.showBlockModal = true;
  }

  async saveBlock() {
    const blockName = (this.blockForm.blockName || '').trim();
    if (!blockName) {
      this.blockFormError = 'Blok adı boş olamaz.';
      return;
    }
    const totalFloors = Number(this.blockForm.totalFloors) || 1;
    const elevatorCount = this.blockForm.elevatorCount !== undefined && this.blockForm.elevatorCount !== null
      ? Number(this.blockForm.elevatorCount)
      : 0;

    const prop: CreateOrUpdateBlock = {
      blockName,
      totalFloors,
      elevatorCount
    };

    this.isBlockSaving = true;
    this.blockFormError = '';
    try {
      await firstValueFrom(this.housingService.changeHousing(this.selectedBlockHousingId));
      if (this.selectedBlockId) {
        await firstValueFrom(this.housingService.updateBlock(this.selectedBlockId, prop));
      } else {
        await firstValueFrom(this.housingService.createBlock(prop));
      }
      this.bloksMap[this.selectedBlockHousingId] = await firstValueFrom(this.housingService.getBlockList({ housingId: this.selectedBlockHousingId }));
      this.showBlockModal = false;
    } catch (err: any) {
      this.blockFormError = err.error?.error?.message || (this.selectedBlockId ? 'Blok güncellenirken bir hata oluştu.' : 'Blok eklenirken bir hata oluştu.');
    } finally {
      this.isBlockSaving = false;
    }
  }

  async updateBlock() {
    await this.saveBlock();
  }

  async blokSil(housingId: string, blokId: string) {
    if (!confirm('Bu bloğu silmek istediğinize emin misiniz?')) return;
    try {
      await firstValueFrom(this.housingService.deleteBlockById(blokId));
      this.bloksMap[housingId] = await firstValueFrom(this.housingService.getBlockList({ housingId }));
    } catch {
      // ignore
    }
  }
}
