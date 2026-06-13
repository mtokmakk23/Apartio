export interface Daire {
  id: number;
  daireNo: string;
  blok: string;
  kat: number;
  tip: string;
  metrekare: number;
  durum: 'Dolu' | 'Boş' | 'Bakımda';
  sakinAdi?: string;
  telefon?: string;
}
