import { Component, OnInit } from '@angular/core';
import { Asset, AssetMaintenanceLog, AssetStatus, DEMIRBAS_DURUMLARI, DEMIRBAS_KATEGORILERI, LocationOption } from '../asset.model';
import { AssetService } from '../asset.service';
import { HousingService, HousingDto, BlockDto } from '@proxy/housings';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];

  // Seçili Housing ve Bağlı Bloklar
  seciliHousing: HousingDto | null = null;
  bloklar: BlockDto[] = [];
  konumSecenekleri: LocationOption[] = [];

  // Filtreler
  aramaMetni: string = '';
  secilenKategori: string = '';
  secilenDurum: string = '';
  secilenKonum: string = '';

  // Demirbaş Ekle / Düzenle Modal
  showModal: boolean = false;
  seciliAsset: Asset | null = null;
  form: Partial<Asset> = {};
  validationHata: string = '';

  // Demirbaş Detay Modal
  showDetayModal: boolean = false;
  detayAsset: Asset | null = null;
  assetLogs: AssetMaintenanceLog[] = [];

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
    await this.housingVeKonumlariYukle();
    this.verileriYukle();
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

  verileriYukle(): void {
    // Seçili apartman/site GUID'ine göre demirbaşları getir
    const housingId = this.seciliHousing?.id;
    this.assets = this.assetService.getAssets(housingId);
    this.filtrele();

    if (this.detayAsset) {
      this.assetLogs = this.assetService.getLogsByAssetId(this.detayAsset.id);
    }
  }

  filtrele(): void {
    const q = this.aramaMetni.trim().toLowerCase();
    this.filteredAssets = this.assets.filter(a => {
      const aramaUyumu =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        (a.supplier && a.supplier.toLowerCase().includes(q));

      const kategoriUyumu = !this.secilenKategori || a.category === this.secilenKategori;
      const durumUyumu = !this.secilenDurum || a.status === this.secilenDurum;
      const konumUyumu = !this.secilenKonum || a.locationId === this.secilenKonum;

      return aramaUyumu && kategoriUyumu && durumUyumu && konumUyumu;
    });
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
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(tarih)) return tarih; // Zaten dd.MM.yyyy
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

  // Takvimden seçim yapıldığında (YYYY-MM-DD -> dd.MM.yyyy çevirir)
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

    // Varsayılan ilk konumu (site/apartman ortak alan) seç
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

  kaydet(): void {
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

    // Kod teklik kontrolü (Tüm tabloda değil, sadece aynı bina/yapı içerisinde benzersiz olmalı)
    const targetHousingId = this.seciliHousing?.id || this.form.housingId || 'default-housing';
    const allAssets = this.assetService.getAllAssetsRaw();
    const ayniKod = allAssets.find(
      a =>
        a.code.toUpperCase() === this.form.code!.trim().toUpperCase() &&
        a.id !== this.seciliAsset?.id &&
        ((a.housingId && a.housingId === targetHousingId) || (!a.housingId && targetHousingId === 'default-housing'))
    );
    if (ayniKod) {
      this.validationHata = `"${this.form.code}" kodu bu bina/yapı içerisinde zaten başka bir demirbaş için kullanılıyor! Farklı binalarda aynı kodu kullanabilirsiniz.`;
      return;
    }

    this.konumMetniniOlustur();

    this.assetService.saveAsset(
      {
        ...this.form,
        housingId: this.seciliHousing?.id || this.form.housingId,
        code: this.form.code.trim().toUpperCase(),
        id: this.seciliAsset?.id
      },
      this.seciliHousing?.id
    );

    this.showModal = false;
    this.verileriYukle();
  }

  sil(asset: Asset, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (confirm(`"${asset.name}" (${asset.code}) demirbaşını ve tüm bakım geçmişini silmek istediğinize emin misiniz?`)) {
      this.assetService.deleteAsset(asset.id);
      if (this.detayAsset?.id === asset.id) {
        this.showDetayModal = false;
      }
      this.verileriYukle();
    }
  }

  // --- Detay Modalı ---
  detayAc(asset: Asset): void {
    this.detayAsset = asset;
    this.assetLogs = this.assetService.getLogsByAssetId(asset.id);
    this.showDetayModal = true;
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

  bakimKaydiKaydet(): void {
    this.logValidationHata = '';
    if (!this.logForm.description?.trim()) {
      this.logValidationHata = 'Yapılan işlem / arıza açıklaması zorunludur.';
      return;
    }
    if ((this.logForm.cost ?? 0) < 0) {
      this.logValidationHata = 'Masraf tutarı 0 veya daha büyük olmalıdır.';
      return;
    }

    this.assetService.addMaintenanceLog({
      asset_id: this.detayAsset!.id,
      maintenance_date: this.logForm.maintenance_date || this.bugunTarih(),
      description: this.logForm.description.trim(),
      cost: Number(this.logForm.cost) || 0,
      performed_by: this.logForm.performed_by?.trim() || ''
    });

    this.showLogModal = false;
    this.verileriYukle();
  }

  bakimKaydiSil(id: string): void {
    if (confirm('Bu bakım kaydını silmek istediğinize emin misiniz?')) {
      this.assetService.deleteMaintenanceLog(id);
      this.verileriYukle();
    }
  }
}
