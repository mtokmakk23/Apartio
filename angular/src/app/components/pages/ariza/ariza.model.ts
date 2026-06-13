export interface Ariza {
  id: number;
  daireNo: string;
  blok: string;
  sakinAdi: string;
  telefon: string;
  kategori: 'Tesisat' | 'Elektrik' | 'Isıtma' | 'Kapı/Kilit' | 'Asansör' | 'Diğer';
  konu: string;
  aciklama: string;
  tarih: string;
  durum: 'Bekliyor' | 'İşlemde' | 'Tamamlandı' | 'İptal';
  oncelik: 'Düşük' | 'Normal' | 'Acil';
  tamamlanmaTarihi?: string;
}
