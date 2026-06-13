export interface Aidat {
  id: number;
  daireNo: string;
  blok: string;
  sakinAdi: string;
  ay: string;
  yil: number;
  tutar: number;
  odemeTarihi?: string;
  durum: 'Ödendi' | 'Bekliyor' | 'Gecikmiş';
  aciklama?: string;
}
