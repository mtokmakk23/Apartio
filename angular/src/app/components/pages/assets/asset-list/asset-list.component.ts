import { Component, OnInit } from '@angular/core';
import { Asset, AssetMaintenanceLog, AssetStatus, DEMIRBAS_DURUMLARI, DEMIRBAS_KATEGORILERI, LocationOption } from '../asset.model';
import { AssetService } from '../asset.service';
import { HousingService, HousingDto, BlockDto } from '@proxy/housings';
import type { CreateOrUpdateAssetDto } from '@proxy/assets';
import { firstValueFrom, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  loading: boolean = false;
  isSaving: boolean = false;
  isLogSaving: boolean = false;

  // Ana Filtre: Seçili Housing (Site / Apartman) ve Bağlı Bloklar
  seciliHousing: HousingDto | null = null;
  bloklar: BlockDto[] = [];
  konumSecenekleri: LocationOption[] = [];

  // Filtreler (BE seviyesinde filtrelenir)
  aramaMetni: string = '';
  secilenKategori: string = '';
  secilenDurum: string = '';
  secilenKonum: string = ''; // İkinci filtre: O siteye ait bina veya blok (LocationId)

  private searchSubject = new Subject<string>();

  // Demirbaş Ekle / Düzenle Modal
  showModal: boolean = false;
  seciliAsset: Asset | null = null;
  form: Partial<Asset> = {};
  validationHata: string = '';

  // Demirbaş Detay Modal
  showDetayModal: boolean = false;
  detayAsset: Asset | null = null;
  assetLogs: AssetMaintenanceLog[] = [];
  logLoading: boolean = false;

  // Bakım / Servis Kaydı Ekle Modal
  showLogModal: boolean = false;
  logForm: Partial<AssetMaintenanceLog> = {};
  logValidationHata: string = '';

  readonly kategoriler = DEMIRBAS_KATEGORILERI;
  readonly durumlar = DEMIRBAS_DURUMLARI;

  constructor(
    private assetService: AssetService,
    private housingService: HousingService
  ) {}

  async ngOnInit(): Promise<void> {
    // Arama için debounce
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(() => {
      this.verileriYukle();
    });

    await this.housingVeKonumlariYukle();
    await this.verileriYukle();
  }

  async housingVeKonumlariYukle(): Promise<void> {
    try {
      this.seciliHousing = await firstValueFrom(this.housingService.getSelectedHousing());
    } catch {
      this.seciliHousing = null;
    }

    if (!this.seciliHousing) {
      try {
        const list = await firstValueFrom(this.housingService.getList());
        if (list && list.length > 0) {
          this.seciliHousing = list[0];
        }
      } catch {}
    }

    // Blokları yükle
    try {
      this.bloklar = await firstValueFrom(this.housingService.getBlockList());
    } catch {
      this.bloklar = [];
    }

    // Konum Seçeneklerini (GUID bazlı) oluştur
    this.konumSecenekleri = [];
    if (this.seciliHousing) {
      const typeLabel = this.seciliHousing.typeName || 'Yapı';
      this.konumSecenekleri.push({
        id: this.seciliHousing.id,
        name: `${this.seciliHousing.name || 'Genel'} (Ortak Alan / ${typeLabel})`,
        type: typeLabel
      });
    }

    if (this.bloklar && this.bloklar.length > 0) {
      for (const b of this.bloklar) {
        this.konumSecenekleri.push({
          id: b.id,
          name: `${b.blockName || 'Blok'}`,
          type: 'Blok'
        });
      }
    }
  }

  /**
   * 1. ANA FİLTRE: Yukarıdan seçilen site parametresi (seciliHousing.id).
   * 2. İKİNCİ FİLTRE: Sayfadaki konum/blok filtresi (secilenKonum).
   * Veriler doğrudan Backend'den filtrelenerek getirilir; FE filtreleme güvenlik açığını önler.
   */
  async verileriYukle(): Promise<void> {
    this.loading = true;
    try {
      const housingId = this.seciliHousing?.id;
      const list = await firstValueFrom(
        this.assetService.getList({
          housingId: housingId,
          locationId: this.secilenKonum || undefined,
          category: this.secilenKategori || undefined,
          status: this.secilenDurum || undefined,
          filter: this.aramaMetni?.trim() || undefined
        })
      );
      this.assets = list || [];
      this.filteredAssets = [...this.assets];

      if (this.detayAsset) {
        await this.logsYukle(this.detayAsset.id);
      }
    } catch {
      this.assets = [];
      this.filteredAssets = [];
    } finally {
      this.loading = false;
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.aramaMetni);
  }

  onFiltreDegisti(): void {
    this.verileriYukle();
  }

  // --- İstatistikler ---
  toplamDemirbas(): number {
    return this.assets.length;
  }

  toplamAktif(): number {
    return this.assets.filter(a => a.status === 'Aktif').length;
  }

  toplamBakimda(): number {
    return this.assets.filter(a => a.status === 'Bakımda').length;
  }

  toplamHurda(): number {
    return this.assets.filter(a => a.status === 'Hurdaya Çıktı').length;
  }

  durumBadge(status: AssetStatus): string {
    switch (status) {
      case 'Aktif':
        return 'bg-success-subtle text-success';
      case 'Bakımda':
        return 'bg-warning-subtle text-warning';
      case 'Hurdaya Çıktı':
        return 'bg-danger-subtle text-danger';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  // --- Tarih Formatlama & Yönetimi (dd.MM.yyyy) ---
  bugunTarih(): string {
    const d = new Date();
    return (
      String(d.getDate()).padStart(2, '0') +
      '.' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '.' +
      d.getFullYear()
    );
  }

  tarihFormatla(tarih?: string): string {
    if (!tarih) return '—';
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(tarih)) return tarih;
    const d = new Date(tarih);
    if (isNaN(d.getTime())) return tarih;
    return (
      String(d.getDate()).padStart(2, '0') +
      '.' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '.' +
      d.getFullYear()
    );
  }

  toIsoDate(tarih?: string): string {
    if (!tarih) return '';
    const clean = tarih.trim();
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(clean)) {
      const parts = clean.split('.');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      return clean;
    }
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return '';
  }

  private parseDateToIso(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    const clean = dateStr.trim();
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(clean)) {
      const parts = clean.split('.');
      return `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
      return clean;
    }
    const d = new Date(clean);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  }

  takvimAc(picker: HTMLInputElement, tarihDegeri?: string): void {
    if (picker) {
      const iso = this.toIsoDate(tarihDegeri);
      if (iso) {
        picker.value = iso;
      }
      if (typeof picker.showPicker === 'function') {
        try {
          picker.showPicker();
        } catch {
          picker.focus();
        }
      } else {
        picker.focus();
      }
    }
  }

  tarihSecildi(event: Event, field: 'purchase_date' | 'warranty_end_date' | 'maintenance_date'): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      const parts = input.value.split('-');
      if (parts.length === 3) {
        const ddMmYyyy = `${parts[2]}.${parts[1]}.${parts[0]}`;
        if (field === 'maintenance_date') {
          this.logForm.maintenance_date = ddMmYyyy;
        } else {
          this.form[field] = ddMmYyyy;
        }
      }
    }
  }

  tarihInputFormatla(field: 'purchase_date' | 'warranty_end_date' | 'maintenance_date'): void {
    const val = field === 'maintenance_date' ? this.logForm.maintenance_date : this.form[field];
    if (val && !/^\d{2}\.\d{2}\.\d{4}$/.test(val)) {
      const formatted = this.tarihFormatla(val);
      if (field === 'maintenance_date') {
        this.logForm.maintenance_date = formatted;
      } else {
        this.form[field] = formatted;
      }
    }
  }

  // --- Konum / Blok GUID Seçim Mantığı ---
  konumSecildi(locationId: string): void {
    const opt = this.konumSecenekleri.find(k => k.id === locationId);
    if (opt) {
      this.form.locationId = opt.id;
      this.form.locationType = opt.type;
      this.konumMetniniOlustur();
    }
  }

  konumDetayGuncelle(): void {
    this.konumMetniniOlustur();
  }

  private konumMetniniOlustur(): void {
    const opt = this.konumSecenekleri.find(k => k.id === this.form.locationId);
    const anaKonum = opt ? opt.name : '';
    const detay = this.form.locationDetail?.trim() || '';
    if (anaKonum && detay) {
      this.form.location = `${anaKonum} - ${detay}`;
    } else {
      this.form.location = anaKonum || detay;
    }
  }

  // --- Ekle / Düzenle ---
  yeniDemirbas(): void {
    this.seciliAsset = null;
    this.validationHata = '';

    const defaultOpt = this.konumSecenekleri[0];

    this.form = {
      housingId: this.seciliHousing?.id || defaultOpt?.id || '',
      locationId: defaultOpt?.id || '',
      locationType: defaultOpt?.type || '',
      locationDetail: '',
      location: defaultOpt?.name || '',
      name: '',
      code: '',
      category: 'Teknik',
      purchase_date: this.bugunTarih(),
      supplier: '',
      warranty_end_date: '',
      status: 'Aktif',
      notes: ''
    };
    this.showModal = true;
  }

  duzenle(asset: Asset, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.seciliAsset = asset;
    this.validationHata = '';
    this.form = {
      ...asset,
      purchase_date: this.tarihFormatla(asset.purchase_date),
      warranty_end_date: asset.warranty_end_date ? this.tarihFormatla(asset.warranty_end_date) : '',
      locationId: asset.locationId || this.konumSecenekleri[0]?.id || '',
      locationDetail: asset.locationDetail || ''
    };
    this.showModal = true;
  }

  async kaydet(): Promise<void> {
    this.validationHata = '';
    if (!this.form.name?.trim()) {
      this.validationHata = 'Demirbaş adı zorunludur.';
      return;
    }
    if (!this.form.code?.trim()) {
      this.validationHata = 'Demirbaş kodu / barkodu zorunludur.';
      return;
    }
    if (!this.form.locationId) {
      this.validationHata = 'Lütfen bağlı olduğu yapı veya bloğu seçiniz.';
      return;
    }

    this.konumMetniniOlustur();

    const targetHousingId = this.seciliHousing?.id || this.form.housingId;
    const dto: CreateOrUpdateAssetDto = {
      housingId: targetHousingId,
      locationId: this.form.locationId!,
      locationType: this.form.locationType,
      locationDetail: this.form.locationDetail,
      name: this.form.name.trim(),
      code: this.form.code.trim().toUpperCase(),
      category: this.form.category || 'Teknik',
      location: this.form.location || '',
      purchaseDate: this.parseDateToIso(this.form.purchase_date),
      supplier: this.form.supplier?.trim(),
      warrantyEndDate: this.parseDateToIso(this.form.warranty_end_date),
      status: this.form.status || 'Aktif',
      notes: this.form.notes?.trim()
    };

    this.isSaving = true;
    try {
      if (this.seciliAsset?.id) {
        await firstValueFrom(this.assetService.update(this.seciliAsset.id, dto));
      } else {
        await firstValueFrom(this.assetService.create(dto));
      }

      this.showModal = false;
      await this.verileriYukle();
    } catch (err: any) {
      this.validationHata =
        err?.error?.error?.message ||
        err?.error?.message ||
        err?.message ||
        'Kayıt işlemi sırasında bir hata oluştu.';
    } finally {
      this.isSaving = false;
    }
  }

  async sil(asset: Asset, event?: MouseEvent): Promise<void> {
    if (event) event.stopPropagation();
    if (confirm(`"${asset.name}" (${asset.code}) demirbaşını ve tüm bakım geçmişini silmek istediğinize emin misiniz?`)) {
      try {
        await firstValueFrom(this.assetService.delete(asset.id));
        if (this.detayAsset?.id === asset.id) {
          this.showDetayModal = false;
        }
        await this.verileriYukle();
      } catch (err: any) {
        alert(
          err?.error?.error?.message ||
          err?.error?.message ||
          err?.message ||
          'Silme işlemi sırasında hata oluştu.'
        );
      }
    }
  }

  // --- Detay Modalı ---
  async detayAc(asset: Asset): Promise<void> {
    this.detayAsset = asset;
    this.showDetayModal = true;
    await this.logsYukle(asset.id);
  }

  async logsYukle(assetId: string): Promise<void> {
    this.logLoading = true;
    try {
      this.assetLogs = await firstValueFrom(this.assetService.getLogs(assetId));
    } catch {
      this.assetLogs = [];
    } finally {
      this.logLoading = false;
    }
  }

  toplamBakimMaliyeti(): number {
    return this.assetLogs.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  }

  // --- Bakım / Servis Kaydı Ekle ---
  yeniBakimKaydiAc(): void {
    if (!this.detayAsset) return;
    this.logValidationHata = '';
    this.logForm = {
      asset_id: this.detayAsset.id,
      maintenance_date: this.bugunTarih(),
      description: '',
      cost: 0,
      performed_by: ''
    };
    this.showLogModal = true;
  }

  async bakimKaydiKaydet(): Promise<void> {
    this.logValidationHata = '';
    if (!this.logForm.description?.trim()) {
      this.logValidationHata = 'Yapılan işlem / arıza açıklaması zorunludur.';
      return;
    }
    if ((this.logForm.cost ?? 0) < 0) {
      this.logValidationHata = 'Masraf tutarı 0 veya daha büyük olmalıdır.';
      return;
    }

    this.isLogSaving = true;
    try {
      await firstValueFrom(
        this.assetService.createLog({
          assetId: this.detayAsset!.id,
          maintenanceDate: this.parseDateToIso(this.logForm.maintenance_date) || new Date().toISOString(),
          description: this.logForm.description.trim(),
          cost: Number(this.logForm.cost) || 0,
          performedBy: this.logForm.performed_by?.trim() || ''
        })
      );

      this.showLogModal = false;
      await this.logsYukle(this.detayAsset!.id);
    } catch (err: any) {
      this.logValidationHata =
        err?.error?.error?.message ||
        err?.error?.message ||
        err?.message ||
        'Bakım kaydı eklenirken bir hata oluştu.';
    } finally {
      this.isLogSaving = false;
    }
  }

  async bakimKaydiSil(id: string): Promise<void> {
    if (confirm('Bu bakım kaydını silmek istediğinize emin misiniz?')) {
      try {
        await firstValueFrom(this.assetService.deleteLog(id));
        if (this.detayAsset) {
          await this.logsYukle(this.detayAsset.id);
        }
      } catch (err: any) {
        alert(
          err?.error?.error?.message ||
          err?.error?.message ||
          err?.message ||
          'Bakım kaydı silinirken hata oluştu.'
        );
      }
    }
  }
}
