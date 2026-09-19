export interface ExpenseModel {
  id: string;
  baslik: string;
  kategori: string;
  tutar: number;
  odenen: number;
  tarih: string;
  vadeTarihi?: string;
  odemeTarihi?: string;
  tedarikci?: string;
  cariHesap?: string;
  kasa?: string;
  evrakNo?: string;
  aciklama?: string;
  durum: 'Bekliyor' | 'Ödendi' | 'Kısmi Ödendi' | 'İptal';
  housingId?: string;
  tekrarlayan?: boolean;
  tekrarPeriyot?: 'Aylık' | 'Yıllık';
  faturaDosyasi?: string;
  faturaDosyasiAdi?: string;
}

export interface ButceModel {
  kategori: string;
  butce: number;
  housingId?: string;
}

export const GIDER_KATEGORILERI = [
  'Temizlik', 'Elektrik', 'Su', 'Doğalgaz', 'Asansör Bakım',
  'Güvenlik', 'Peyzaj / Bahçe', 'Boya / Badana', 'Tadilat',
  'Sigorta', 'Yönetim Gideri', 'Personel Maaşı', 'Vergi / Harç', 'Diğer',
];

export const KASA_LISTESI = ['Nakit Kasa', 'Banka - Garanti', 'Banka - Ziraat', 'Banka - İş Bankası', 'Diğer'];
