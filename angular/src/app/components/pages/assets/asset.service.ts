import { Injectable } from '@angular/core';
import { Asset, AssetMaintenanceLog } from './asset.model';

const STORAGE_ASSETS_KEY = 'apartio_assets';
const STORAGE_LOGS_KEY = 'apartio_asset_logs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private initialAssets: Asset[] = [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      housingId: 'default-housing',
      locationId: 'b1111111-1111-1111-1111-111111111111',
      locationType: 'Blok',
      locationDetail: 'Asansör Dairesi',
      name: 'Ana Asansör Motoru (10 Kişilik)',
      code: 'ASAN-01',
      category: 'Teknik',
      location: 'A Blok - Asansör Dairesi',
      purchase_date: '15.04.2023',
      supplier: 'Kone Asansör Sanayi',
      warranty_end_date: '15.04.2027',
      status: 'Aktif',
      notes: 'Yıllık yeşil etiket muayenesi yapıldı. Bakımları aylık periyotla yürütülmektedir.'
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      housingId: 'default-housing',
      locationId: 'default-housing',
      locationType: 'Site',
      locationDetail: 'Otopark -2 Jen. Odası',
      name: 'Ortak Alan Dizel Jeneratör (150 kVA)',
      code: 'JEN-01',
      category: 'Teknik',
      location: 'Site Ortak Alan - Otopark -2 Jen. Odası',
      purchase_date: '10.09.2022',
      supplier: 'Aksa Jeneratör',
      warranty_end_date: '10.09.2025',
      status: 'Aktif',
      notes: 'Haftalık periyodik boşta çalışma testi her pazartesi saat 10:00 yapılmaktadır.'
    },
    {
      id: 'a3333333-3333-3333-3333-333333333333',
      housingId: 'default-housing',
      locationId: 'default-housing',
      locationType: 'Apartman',
      locationDetail: 'Güvenlik Kulübesi',
      name: 'Çevre Güvenlik Kamera Sistemi (16 Kanal NVR)',
      code: 'KAM-01',
      category: 'Güvenlik',
      location: 'Apartman Ortak Alan - Güvenlik Kulübesi',
      purchase_date: '20.01.2024',
      supplier: 'Hikvision Türkiye',
      warranty_end_date: '20.01.2026',
      status: 'Bakımda',
      notes: '2 nolu kamera sinyal kaybı yaşıyor, koaksiyel kablo kontrolü yapılacak.'
    },
    {
      id: 'a4444444-4444-4444-4444-444444444444',
      housingId: 'default-housing',
      locationId: 'default-housing',
      locationType: 'Site',
      locationDetail: 'Bahçe Su Deposu',
      name: 'Otomatik Bahçe Sulama Pompası',
      code: 'PEY-01',
      category: 'Peyzaj',
      location: 'Site Ortak Alan - Bahçe Su Deposu',
      purchase_date: '01.06.2021',
      supplier: 'Wilo Pompa Sistemleri',
      warranty_end_date: '01.06.2023',
      status: 'Hurdaya Çıktı',
      notes: 'Motor sargısı yandı, hurdaya ayrıldı. Yeni pompa alımı planlanacak.'
    }
  ];

  private initialLogs: AssetMaintenanceLog[] = [
    {
      id: 'm1111111-1111-1111-1111-111111111111',
      asset_id: 'a1111111-1111-1111-1111-111111111111',
      maintenance_date: '10.03.2024',
      description: 'Aylık periyodik yağlama, halat gergi kontrolü ve fren balata testi yapıldı.',
      cost: 1850,
      performed_by: 'Kone Yetkili Servis - Usta Murat'
    },
    {
      id: 'm2222222-2222-2222-2222-222222222222',
      asset_id: 'a1111111-1111-1111-1111-111111111111',
      maintenance_date: '15.09.2024',
      description: 'Hız regülatörü ayarı ve kapı kilit kontakları yenilendi.',
      cost: 3400,
      performed_by: 'Kone Yetkili Servis - Tekniker Can'
    },
    {
      id: 'm3333333-3333-3333-3333-333333333333',
      asset_id: 'a2222222-2222-2222-2222-222222222222',
      maintenance_date: '20.05.2024',
      description: 'Yağ filtresi, yakıt filtresi ve 40 lt motor yağı değişimi yapıldı.',
      cost: 6200,
      performed_by: 'Aksa Yetkili Servis'
    }
  ];

  constructor() {
    if (!localStorage.getItem(STORAGE_ASSETS_KEY)) {
      localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(this.initialAssets));
    }
    if (!localStorage.getItem(STORAGE_LOGS_KEY)) {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(this.initialLogs));
    }
  }

  getAllAssetsRaw(): Asset[] {
    const raw = localStorage.getItem(STORAGE_ASSETS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getAssets(housingId?: string): Asset[] {
    const raw = localStorage.getItem(STORAGE_ASSETS_KEY);
    let all: Asset[] = raw ? JSON.parse(raw) : [];

    // Seçili apartman/site ID'sine göre filtrele
    if (housingId) {
      all = all.filter(a => !a.housingId || a.housingId === 'default-housing' || a.housingId === housingId);
    }
    return all;
  }

  saveAsset(asset: Partial<Asset>, housingId?: string): Asset {
    const raw = localStorage.getItem(STORAGE_ASSETS_KEY);
    const assets: Asset[] = raw ? JSON.parse(raw) : [];
    const now = new Date().toISOString();

    const activeHousingId = housingId || asset.housingId || 'default-housing';

    if (asset.id) {
      const idx = assets.findIndex(a => a.id === asset.id);
      if (idx !== -1) {
        assets[idx] = {
          ...assets[idx],
          ...asset,
          housingId: assets[idx].housingId || activeHousingId,
          updated_at: now
        } as Asset;
        localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(assets));
        return assets[idx];
      }
    }

    const newAsset: Asset = {
      ...(asset as any),
      id: crypto.randomUUID ? crypto.randomUUID() : `asset-${Date.now()}`,
      housingId: activeHousingId,
      created_at: now,
      updated_at: now
    };
    assets.unshift(newAsset);
    localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(assets));
    return newAsset;
  }

  deleteAsset(id: string): void {
    const raw = localStorage.getItem(STORAGE_ASSETS_KEY);
    let assets: Asset[] = raw ? JSON.parse(raw) : [];
    assets = assets.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(assets));

    // Bağlı logları da sil
    let logs = this.getAllLogs();
    logs = logs.filter(l => l.asset_id !== id);
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  }

  getAllLogs(): AssetMaintenanceLog[] {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getLogsByAssetId(assetId: string): AssetMaintenanceLog[] {
    return this.getAllLogs()
      .filter(l => l.asset_id === assetId);
  }

  addMaintenanceLog(log: Omit<AssetMaintenanceLog, 'id' | 'created_at'>): AssetMaintenanceLog {
    const logs = this.getAllLogs();
    const newLog: AssetMaintenanceLog = {
      ...log,
      id: crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
    return newLog;
  }

  deleteMaintenanceLog(id: string): void {
    let logs = this.getAllLogs();
    logs = logs.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  }
}
