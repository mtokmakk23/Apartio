export type AssetStatus = 'Aktif' | 'Bakımda' | 'Hurdaya Çıktı';

export type AssetCategory =
  | 'Teknik'
  | 'Güvenlik'
  | 'Peyzaj'
  | 'Ortak Alan Mobilyası'
  | 'Temizlik'
  | 'Jeneratör & Enerji'
  | 'Asansör'
  | 'Diğer';

export interface LocationOption {
  id: string; // GUID (Housing ID veya Block ID)
  name: string; // "Güneş Sitesi (Ortak Alan)" veya "A Blok"
  type: string; // 'Site' | 'Apartman' | 'Rezidans' | 'Villa' | 'Blok'
}

export interface Asset {
  id: string;
  housing_id: string; // Apartman / Site / Rezidans / Villa GUID
  location_id: string; // Bağlı olduğu Housing veya Block GUID'i
  location_type?: string;
  location_detail?: string;
  name: string;
  code: string;
  category: AssetCategory | string;
  location: string;
  purchase_date?: string | null;
  supplier?: string | null;
  warranty_end_date?: string | null;
  status: AssetStatus;
  notes?: string | null;
  created_at?: string;
  created_by?: string | null;
  updated_at?: string;
  updated_by?: string | null;
}

export interface AssetMaintenanceLog {
  id: string;
  asset_id: string;
  maintenance_date: string;
  description: string;
  cost: number;
  performed_by?: string | null;
  created_at?: string;
  created_by?: string | null;
}

export interface CreateAssetInput {
  housing_id?: string;
  location_id: string;
  location_type?: string;
  location_detail?: string;
  name: string;
  code: string;
  category: string;
  location: string;
  purchase_date?: string | null;
  supplier?: string | null;
  warranty_end_date?: string | null;
  status: AssetStatus;
  notes?: string | null;
}

export interface UpdateAssetInput extends Partial<CreateAssetInput> {
  id: string;
}

export interface CreateMaintenanceLogInput {
  asset_id: string;
  maintenance_date: string;
  description: string;
  cost: number;
  performed_by?: string | null;
}

export interface AssetFilterState {
  searchQuery: string;
  category: string;
  status: string;
  location_id?: string;
}

export const formatDate = (date?: string | null): string => {
  if (!date) return '—';
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) return date;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return (
    String(d.getDate()).padStart(2, '0') +
    '.' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '.' +
    d.getFullYear()
  );
};

export const toIsoDate = (date?: string | null): string => {
  if (!date) return '';
  const clean = date.trim();
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
};
