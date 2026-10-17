export type AssetStatus = 'Aktif' | 'Bakımda' | 'Hurdaya Çıktı';

export interface LocationOption {
  id: string; // GUID (Housing ID veya Block ID)
  name: string; // Görünecek İsim (örn: "Güneş Sitesi (Ortak Alan)" veya "A Blok")
  type: string; // 'Site' | 'Apartman' | 'Rezidans' | 'Villa' | 'Blok'
}

export interface Asset {
  id: string;
  housingId: string; // Seçili apartman / site / rezidans / villa GUID'i
  locationId: string; // Bağlı olduğu Housing veya Blok GUID'i
  locationType?: string; // 'Site' | 'Apartman' | 'Rezidans' | 'Villa' | 'Blok'
  locationDetail?: string; // Örn: Asansör Dairesi, Çatı, Kazan Dairesi vb.
  name: string;
  code: string;
  category: string;
  location: string; // Görüntülenen konum (örn: "A Blok - Asansör Dairesi")
  purchase_date?: string; // dd.MM.yyyy formatında
  supplier?: string;
  warranty_end_date?: string; // dd.MM.yyyy formatında
  status: AssetStatus;
  notes?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface AssetMaintenanceLog {
  id: string;
  asset_id: string;
  maintenance_date: string; // dd.MM.yyyy formatında
  description: string;
  cost: number;
  performed_by?: string;
  created_at?: string;
  created_by?: string;
}

export const DEMIRBAS_KATEGORILERI: string[] = [
  'Teknik',
  'Güvenlik',
  'Peyzaj',
  'Ortak Alan Mobilyası',
  'Temizlik',
  'Jeneratör & Enerji',
  'Asansör',
  'Diğer'
];

export const DEMIRBAS_DURUMLARI: AssetStatus[] = [
  'Aktif',
  'Bakımda',
  'Hurdaya Çıktı'
];
