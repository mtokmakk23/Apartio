import { Component, OnInit } from '@angular/core';
import { Ariza } from '../ariza.model';

@Component({
  selector: 'app-ariza-list',
  templateUrl: './ariza-list.component.html',
  styleUrls: ['./ariza-list.component.scss']
})
export class ArizaListComponent implements OnInit {

  arizalar: Ariza[] = [
    { id: 1, daireNo: 'D-12', blok: 'D', sakinAdi: 'Hasan Yıldız', telefon: '0532 111 22 33', kategori: 'Tesisat', konu: 'Su tesisatı arızası', aciklama: 'Mutfak lavabosundan su sızıyor.', tarih: '07.06.2026', durum: 'Bekliyor', oncelik: 'Acil' },
    { id: 2, daireNo: 'A-05', blok: 'A', sakinAdi: 'Ahmet Yılmaz', telefon: '0532 111 22 33', kategori: 'Kapı/Kilit', konu: 'Kapı kilidi bozuk', aciklama: 'Daire kapısı kilitlenmiyor.', tarih: '06.06.2026', durum: 'İşlemde', oncelik: 'Normal' },
    { id: 3, daireNo: 'B-08', blok: 'B', sakinAdi: 'Mehmet Kaya', telefon: '0534 333 44 55', kategori: 'Elektrik', konu: 'Elektrik arızası', aciklama: 'Salon prizleri çalışmıyor.', tarih: '05.06.2026', durum: 'Tamamlandı', oncelik: 'Normal', tamamlanmaTarihi: '06.06.2026' },
    { id: 4, daireNo: 'C-03', blok: 'C', sakinAdi: 'Ayşe Çelik', telefon: '0535 444 55 66', kategori: 'Isıtma', konu: 'Isıtma sorunu', aciklama: 'Kombiden sıcak su gelmiyor.', tarih: '04.06.2026', durum: 'Bekliyor', oncelik: 'Acil' },
    { id: 5, daireNo: 'A-02', blok: 'A', sakinAdi: 'Ali Şahin', telefon: '0536 555 66 77', kategori: 'Asansör', konu: 'Asansör arızası', aciklama: 'Asansör 3. katta takılı kalıyor.', tarih: '03.06.2026', durum: 'İşlemde', oncelik: 'Acil' },
    { id: 6, daireNo: 'B-04', blok: 'B', sakinAdi: 'Fatma Demir', telefon: '0533 222 33 44', kategori: 'Diğer', konu: 'Teras çatı sızıntısı', aciklama: 'Yağmurda tavan sızıyor.', tarih: '02.06.2026', durum: 'Bekliyor', oncelik: 'Normal' },
  ];

  filteredArizalar: Ariza[] = [];
  aramaMetni: string = '';
  secilenDurum: string = '';
  secilenOncelik: string = '';
  secilenKategori: string = '';

  showModal: boolean = false;
  showDetayModal: boolean = false;
  seciliAriza: Ariza | null = null;
  form: Partial<Ariza> = {};

  durumlar = ['Bekliyor', 'İşlemde', 'Tamamlandı', 'İptal'];
  oncelikler = ['Düşük', 'Normal', 'Acil'];
  kategoriler = ['Tesisat', 'Elektrik', 'Isıtma', 'Kapı/Kilit', 'Asansör', 'Diğer'];
  bloklar = ['A', 'B', 'C', 'D'];

  ngOnInit(): void {
    this.filtrele();
  }

  filtrele() {
    this.filteredArizalar = this.arizalar.filter(a => {
      const aramaUyumu = !this.aramaMetni ||
        a.daireNo.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        a.sakinAdi.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        a.konu.toLowerCase().includes(this.aramaMetni.toLowerCase());
      const durumUyumu = !this.secilenDurum || a.durum === this.secilenDurum;
      const oncelikUyumu = !this.secilenOncelik || a.oncelik === this.secilenOncelik;
      const kategoriUyumu = !this.secilenKategori || a.kategori === this.secilenKategori;
      return aramaUyumu && durumUyumu && oncelikUyumu && kategoriUyumu;
    });
  }

  yeniAriza() {
    this.seciliAriza = null;
    this.form = { durum: 'Bekliyor', oncelik: 'Normal', tarih: this.bugunTarih() };
    this.showModal = true;
  }

  duzenle(ariza: Ariza) {
    this.seciliAriza = ariza;
    this.form = { ...ariza };
    this.showModal = true;
  }

  detayGoster(ariza: Ariza) {
    this.seciliAriza = ariza;
    this.showDetayModal = true;
  }

  kaydet() {
    if (this.seciliAriza) {
      const idx = this.arizalar.findIndex(a => a.id === this.seciliAriza!.id);
      if (idx > -1) this.arizalar[idx] = { ...this.seciliAriza, ...this.form } as Ariza;
    } else {
      this.arizalar.unshift({ id: Date.now(), ...this.form } as Ariza);
    }
    this.showModal = false;
    this.filtrele();
  }

  durumGuncelle(ariza: Ariza, yeniDurum: string) {
    const idx = this.arizalar.findIndex(a => a.id === ariza.id);
    if (idx > -1) {
      this.arizalar[idx].durum = yeniDurum as any;
      if (yeniDurum === 'Tamamlandı') {
        this.arizalar[idx].tamamlanmaTarihi = this.bugunTarih();
      }
    }
    this.filtrele();
  }

  bugunTarih(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  }

  durumRenk(durum: string): string {
    switch (durum) {
      case 'Bekliyor': return 'warning';
      case 'İşlemde': return 'primary';
      case 'Tamamlandı': return 'success';
      case 'İptal': return 'danger';
      default: return 'secondary';
    }
  }

  oncelikRenk(oncelik: string): string {
    switch (oncelik) {
      case 'Acil': return 'danger';
      case 'Normal': return 'warning';
      case 'Düşük': return 'success';
      default: return 'secondary';
    }
  }

  kategoriIcon(kategori: string): string {
    switch (kategori) {
      case 'Tesisat': return 'ri-water-flash-line';
      case 'Elektrik': return 'ri-flashlight-line';
      case 'Isıtma': return 'ri-fire-line';
      case 'Kapı/Kilit': return 'ri-door-lock-line';
      case 'Asansör': return 'ri-arrow-up-down-line';
      default: return 'ri-tools-line';
    }
  }

  toplamBekleyen() { return this.arizalar.filter(a => a.durum === 'Bekliyor').length; }
  toplamIslemde() { return this.arizalar.filter(a => a.durum === 'İşlemde').length; }
  toplamTamamlanan() { return this.arizalar.filter(a => a.durum === 'Tamamlandı').length; }
  toplamAcil() { return this.arizalar.filter(a => a.oncelik === 'Acil' && a.durum !== 'Tamamlandı').length; }

  whatsappGonder(ariza: Ariza) {
    const telefon = ariza.telefon.replace(/\s/g, '').replace(/^0/, '90');
    const mesaj = `Sayın ${ariza.sakinAdi}, "${ariza.konu}" konulu talebiniz alınmıştır. Durumu: ${ariza.durum}. Apartio Yönetimi`;
    window.open(`https://wa.me/${telefon}?text=${encodeURIComponent(mesaj)}`, '_blank');
  }

  smsGonder(ariza: Ariza) {
    const telefon = ariza.telefon.replace(/\s/g, '');
    const mesaj = `Sayın ${ariza.sakinAdi}, "${ariza.konu}" talebiniz ${ariza.durum} durumundadır. Apartio Yönetimi`;
    window.open(`sms:${telefon}?body=${encodeURIComponent(mesaj)}`, '_self');
  }
}
