import { Component, OnInit } from '@angular/core';
import { Sakin } from '../sakin.model';

@Component({
  selector: 'app-sakin-list',
  templateUrl: './sakin-list.component.html',
  styleUrls: ['./sakin-list.component.scss']
})
export class SakinListComponent implements OnInit {

  sakinler: Sakin[] = [
    { id: 1, ad: 'Ahmet', soyad: 'Yılmaz', tcKimlik: '12345678901', telefon: '0532 111 22 33', email: 'ahmet@email.com', daireNo: 'A-01', blok: 'A', tip: 'Malik', girisTarihi: '01.01.2023', durum: 'Aktif' },
    { id: 2, ad: 'Fatma', soyad: 'Demir', tcKimlik: '23456789012', telefon: '0533 222 33 44', email: 'fatma@email.com', daireNo: 'A-03', blok: 'A', tip: 'Kiracı', girisTarihi: '15.03.2023', durum: 'Aktif' },
    { id: 3, ad: 'Mehmet', soyad: 'Kaya', tcKimlik: '34567890123', telefon: '0534 333 44 55', email: 'mehmet@email.com', daireNo: 'B-01', blok: 'B', tip: 'Malik', girisTarihi: '01.06.2022', durum: 'Aktif' },
    { id: 4, ad: 'Ayşe', soyad: 'Çelik', tcKimlik: '45678901234', telefon: '0535 444 55 66', email: 'ayse@email.com', daireNo: 'C-01', blok: 'C', tip: 'Kiracı', girisTarihi: '01.09.2023', durum: 'Aktif' },
    { id: 5, ad: 'Ali', soyad: 'Şahin', tcKimlik: '56789012345', telefon: '0536 555 66 77', email: 'ali@email.com', daireNo: 'C-02', blok: 'C', tip: 'Malik', girisTarihi: '01.01.2021', durum: 'Aktif' },
    { id: 6, ad: 'Zeynep', soyad: 'Arslan', tcKimlik: '67890123456', telefon: '0537 666 77 88', email: 'zeynep@email.com', daireNo: 'D-01', blok: 'D', tip: 'Kiracı', girisTarihi: '01.04.2024', durum: 'Pasif' },
  ];

  filteredSakinler: Sakin[] = [];
  aramaMetni: string = '';
  secilenBlok: string = '';
  secilenTip: string = '';
  secilenDurum: string = '';

  showModal: boolean = false;
  seciliSakin: Sakin | null = null;
  silmeOnayModal: boolean = false;
  silinecekId: number | null = null;

  form: Partial<Sakin> = {};

  bloklar = ['A', 'B', 'C', 'D'];
  tipler = ['Malik', 'Kiracı'];
  durumlar = ['Aktif', 'Pasif'];

  ngOnInit(): void {
    this.filtrele();
  }

  filtrele() {
    this.filteredSakinler = this.sakinler.filter(s => {
      const aramaUyumu = !this.aramaMetni ||
        s.ad.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        s.soyad.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        s.daireNo.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        s.telefon.includes(this.aramaMetni);
      const blokUyumu = !this.secilenBlok || s.blok === this.secilenBlok;
      const tipUyumu = !this.secilenTip || s.tip === this.secilenTip;
      const durumUyumu = !this.secilenDurum || s.durum === this.secilenDurum;
      return aramaUyumu && blokUyumu && tipUyumu && durumUyumu;
    });
  }

  yeniSakinEkle() {
    this.seciliSakin = null;
    this.form = { tip: 'Malik', durum: 'Aktif' };
    this.showModal = true;
  }

  duzenle(sakin: Sakin) {
    this.seciliSakin = sakin;
    this.form = { ...sakin };
    this.showModal = true;
  }

  kaydet() {
    if (this.seciliSakin) {
      const idx = this.sakinler.findIndex(s => s.id === this.seciliSakin!.id);
      if (idx > -1) this.sakinler[idx] = { ...this.seciliSakin, ...this.form } as Sakin;
    } else {
      const yeni: Sakin = {
        id: Date.now(),
        ad: this.form.ad || '',
        soyad: this.form.soyad || '',
        tcKimlik: this.form.tcKimlik,
        telefon: this.form.telefon || '',
        email: this.form.email,
        daireNo: this.form.daireNo || '',
        blok: this.form.blok || '',
        tip: this.form.tip || 'Malik',
        girisTarihi: this.form.girisTarihi || '',
        durum: this.form.durum || 'Aktif',
      };
      this.sakinler.push(yeni);
    }
    this.showModal = false;
    this.filtrele();
  }

  silmeOnayla(id: number) {
    this.silinecekId = id;
    this.silmeOnayModal = true;
  }

  silOnay() {
    this.sakinler = this.sakinler.filter(s => s.id !== this.silinecekId);
    this.silmeOnayModal = false;
    this.filtrele();
  }

  toplamAktif() { return this.sakinler.filter(s => s.durum === 'Aktif').length; }
  toplamMalik() { return this.sakinler.filter(s => s.tip === 'Malik').length; }
  toplamKiraci() { return this.sakinler.filter(s => s.tip === 'Kiracı').length; }

  whatsappGonder(sakin: any, mesaj?: string) {
    const telefon = sakin.telefon.replace(/\s/g, '').replace(/^0/, '90');
    const varsayilanMesaj = mesaj || `Sayın ${sakin.ad} ${sakin.soyad}, Apartio yönetiminden bilgilendirme mesajıdır.`;
    const url = `https://wa.me/${telefon}?text=${encodeURIComponent(varsayilanMesaj)}`;
    window.open(url, '_blank');
  }

  smsGonder(sakin: any, mesaj?: string) {
    const telefon = sakin.telefon.replace(/\s/g, '');
    const varsayilanMesaj = mesaj || `Sayın ${sakin.ad} ${sakin.soyad}, Apartio yönetiminden bilgilendirme mesajıdır.`;
    window.open(`sms:${telefon}?body=${encodeURIComponent(varsayilanMesaj)}`, '_self');
  }
}
