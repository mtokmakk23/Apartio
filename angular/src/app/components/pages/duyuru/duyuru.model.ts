export interface Duyuru {
  id: number;
  baslik: string;
  icerik: string;
  kategori: 'Genel' | 'Bakım' | 'Aidat' | 'Toplantı' | 'Acil';
  tarih: string;
  yayinDurumu: 'Yayında' | 'Taslak';
  onemli: boolean;
  hedef: 'Tümü' | 'A Blok' | 'B Blok' | 'C Blok' | 'D Blok';
}
