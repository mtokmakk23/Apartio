export interface Sakin {
  id: number;
  ad: string;
  soyad: string;
  tcKimlik?: string;
  telefon: string;
  email?: string;
  daireNo: string;
  blok: string;
  tip: 'Malik' | 'Kiracı';
  girisTarihi: string;
  durum: 'Aktif' | 'Pasif';
}
