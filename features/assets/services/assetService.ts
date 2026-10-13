import {
  Asset,
  AssetMaintenanceLog,
  CreateAssetInput,
  UpdateAssetInput,
  CreateMaintenanceLogInput
} from '../types/asset.types';

// Supabase client instance (Kendi supabase.ts dosyanızdan import edebilirsiniz)
// import { supabase } from '@/lib/supabase';
declare const supabase: any;

const isSupabaseConfigured = () => typeof supabase !== 'undefined' && !!supabase?.from;

// LocalStorage yedek önbellek anahtarları
const LOCAL_STORAGE_ASSETS_KEY = 'apartio_assets_data';
const LOCAL_STORAGE_LOGS_KEY = 'apartio_asset_logs_data';

const initialMockAssets: Asset[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Ana Asansör Motoru (10 Kişilik)',
    code: 'ASAN-01',
    category: 'Teknik',
    location: 'A Blok Asansör Dairesi',
    purchase_date: '2023-04-15',
    supplier: 'Kone Asansör Sanayi',
    warranty_end_date: '2027-04-15',
    status: 'Aktif',
    notes: 'Yıllık yeşil etiket muayenesi yapıldı.'
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Ortak Alan Dizel Jeneratör (150 kVA)',
    code: 'JEN-01',
    category: 'Teknik',
    location: 'Otopark -2 Jen. Odası',
    purchase_date: '2022-09-10',
    supplier: 'Aksa Jeneratör',
    warranty_end_date: '2025-09-10',
    status: 'Aktif',
    notes: 'Haftalık periyodik boşta çalışma testi yapılıyor.'
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'Çevre Güvenlik Kamera Sistemi (16 Kanal NVR)',
    code: 'KAM-01',
    category: 'Güvenlik',
    location: 'Güvenlik Kulübesi',
    purchase_date: '2024-01-20',
    supplier: 'Hikvision Türkiye',
    warranty_end_date: '2026-01-20',
    status: 'Bakımda',
    notes: '2 nolu kamera sinyal kaybı yaşıyor, kablo kontrolü yapılacak.'
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'Otomatik Bahçe Sulama Pompası',
    code: 'PEY-01',
    category: 'Peyzaj',
    location: 'Bahçe Su Deposu',
    purchase_date: '2021-06-01',
    supplier: 'Wilo Pompa Sistemleri',
    warranty_end_date: '2023-06-01',
    status: 'Hurdaya Çıktı',
    notes: 'Motor sargısı yandı, yenisiyle değiştirildi.'
  }
];

const initialMockLogs: AssetMaintenanceLog[] = [
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    asset_id: 'a1111111-1111-1111-1111-111111111111',
    maintenance_date: '2024-03-10',
    description: 'Aylık periyodik yağlama, halat gergi kontrolü ve fren balata testi yapıldı.',
    cost: 1850,
    performed_by: 'Kone Yetkili Servis - Usta Murat'
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    asset_id: 'a1111111-1111-1111-1111-111111111111',
    maintenance_date: '2024-09-15',
    description: 'Hız regülatörü ayarı ve kapı kilit kontakları yenilendi.',
    cost: 3400,
    performed_by: 'Kone Yetkili Servis - Tekniker Can'
  },
  {
    id: 'm3333333-3333-3333-3333-333333333333',
    asset_id: 'a2222222-2222-2222-2222-222222222222',
    maintenance_date: '2024-05-20',
    description: 'Yağ filtresi, yakıt filtresi ve 40 lt motor yağı değişimi yapıldı.',
    cost: 6200,
    performed_by: 'Aksa Yetkili Servis'
  }
];

const getStoredAssets = (): Asset[] => {
  if (typeof window === 'undefined') return initialMockAssets;
  const stored = localStorage.getItem(LOCAL_STORAGE_ASSETS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_ASSETS_KEY, JSON.stringify(initialMockAssets));
    return initialMockAssets;
  }
  return JSON.parse(stored);
};

const saveStoredAssets = (assets: Asset[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_ASSETS_KEY, JSON.stringify(assets));
  }
};

const getStoredLogs = (): AssetMaintenanceLog[] => {
  if (typeof window === 'undefined') return initialMockLogs;
  const stored = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(initialMockLogs));
    return initialMockLogs;
  }
  return JSON.parse(stored);
};

const saveStoredLogs = (logs: AssetMaintenanceLog[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
  }
};

export const assetService = {
  // 1. Tüm Demirbaşları Getir
  async getAssets(): Promise<Asset[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return getStoredAssets();
  },

  // 2. Tek Demirbaş Getir
  async getAssetById(id: string): Promise<Asset | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
    const assets = getStoredAssets();
    return assets.find(a => a.id === id) || null;
  },

  // 3. Yeni Demirbaş Ekle
  async createAsset(input: CreateAssetInput): Promise<Asset> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('assets')
        .insert([input])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const assets = getStoredAssets();
    const newAsset: Asset = {
      ...input,
      id: crypto.randomUUID ? crypto.randomUUID() : `asset-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    assets.unshift(newAsset);
    saveStoredAssets(assets);
    return newAsset;
  },

  // 4. Demirbaş Güncelle
  async updateAsset(input: UpdateAssetInput): Promise<Asset> {
    const { id, ...updates } = input;
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const assets = getStoredAssets();
    const index = assets.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Demirbaş bulunamadı.');
    assets[index] = { ...assets[index], ...updates, updated_at: new Date().toISOString() };
    saveStoredAssets(assets);
    return assets[index];
  },

  // 5. Demirbaş Sil
  async deleteAsset(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    let assets = getStoredAssets();
    assets = assets.filter(a => a.id !== id);
    saveStoredAssets(assets);
  },

  // 6. Demirbaşa Ait Bakım/Arıza Kayıtlarını Getir
  async getMaintenanceLogs(assetId: string): Promise<AssetMaintenanceLog[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('asset_maintenance_logs')
        .select('*')
        .eq('asset_id', assetId)
        .order('maintenance_date', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    const logs = getStoredLogs();
    return logs.filter(l => l.asset_id === assetId).sort((a, b) => b.maintenance_date.localeCompare(a.maintenance_date));
  },

  // 7. Yeni Bakım Kaydı Ekle
  async createMaintenanceLog(input: CreateMaintenanceLogInput): Promise<AssetMaintenanceLog> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('asset_maintenance_logs')
        .insert([input])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const logs = getStoredLogs();
    const newLog: AssetMaintenanceLog = {
      ...input,
      id: crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    logs.unshift(newLog);
    saveStoredLogs(logs);
    return newLog;
  },

  // 8. Bakım Kaydı Sil
  async deleteMaintenanceLog(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('asset_maintenance_logs').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    let logs = getStoredLogs();
    logs = logs.filter(l => l.id !== id);
    saveStoredLogs(logs);
  }
};
