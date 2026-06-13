import { Component, OnInit } from '@angular/core';
import { Duyuru } from '../duyuru.model';

@Component({
  selector: 'app-duyuru-list',
  templateUrl: './duyuru-list.component.html',
  styleUrls: ['./duyuru-list.component.scss']
})
export class DuyuruListComponent implements OnInit {

  duyurular: Duyuru[] = [
    { id: 1, baslik: 'Asansör Bakımı', icerik: 'Asansör bakımı 10 Haziran Çarşamba günü 09:00-17:00 saatleri arasında yapılacaktır. Bu süre zarfında asansör kullanılamayacaktır.', kategori: 'Bakım', tarih: '05.06.2026', yayinDurumu: 'Yayında', onemli: true, hedef: 'Tümü' },
    { id: 2, baslik: 'Haziran Ayı Aidat Hatırlatması', icerik: 'Haziran 2026 aidatlarının son ödeme tarihi 15 Haziran\'dır. Gecikme durumunda aylık %2 faiz uygulanacaktır.', kategori: 'Aidat', tarih: '01.06.2026', yayinDurumu: 'Yayında', onemli: true, hedef: 'Tümü' },
    { id: 3, baslik: 'Site Temizliği Tamamlandı', icerik: 'Mayıs ayı genel temizliği tamamlanmıştır. Ortak alanların temiz tutulmasına özen gösterilmesi rica olunur.', kategori: 'Genel', tarih: '28.05.2026', yayinDurumu: 'Yayında', onemli: false, hedef: 'Tümü' },
    { id: 4, baslik: 'Yönetim Kurulu Toplantısı', icerik: 'Haziran ayı yönetim kurulu toplantısı 20 Haziran Cumartesi saat 15:00\'te toplantı salonunda yapılacaktır.', kategori: 'Toplantı', tarih: '10.06.2026', yayinDurumu: 'Yayında', onemli: false, hedef: 'Tümü' },
    { id: 5, baslik: 'A Blok Su Kesintisi', icerik: 'A Blok\'ta boru hattı bakımı nedeniyle 12 Haziran saat 10:00-14:00 arasında su kesintisi yaşanacaktır.', kategori: 'Acil', tarih: '09.06.2026', yayinDurumu: 'Yayında', onemli: true, hedef: 'A Blok' },
    { id: 6, baslik: 'Otopark Düzenlemesi', icerik: 'Otopark alanında yeniden düzenleme yapılacaktır. Araç sahiplerinin bilgilendirme toplantısına katılması beklenmektedir.', kategori: 'Genel', tarih: '08.06.2026', yayinDurumu: 'Taslak', onemli: false, hedef: 'Tümü' },
  ];

  filteredDuyurular: Duyuru[] = [];
  aramaMetni: string = '';
  secilenKategori: string = '';
  secilenDurum: string = '';

  showModal: boolean = false;
  showDetayModal: boolean = false;
  seciliDuyuru: Duyuru | null = null;
  form: Partial<Duyuru> = {};

  kategoriler = ['Genel', 'Bakım', 'Aidat', 'Toplantı', 'Acil'];
  hedefler = ['Tümü', 'A Blok', 'B Blok', 'C Blok', 'D Blok'];

  ngOnInit(): void {
    this.filtrele();
  }

  filtrele() {
    this.filteredDuyurular = this.duyurular.filter(d => {
      const aramaUyumu = !this.aramaMetni ||
        d.baslik.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        d.icerik.toLowerCase().includes(this.aramaMetni.toLowerCase());
      const kategoriUyumu = !this.secilenKategori || d.kategori === this.secilenKategori;
      const durumUyumu = !this.secilenDurum || d.yayinDurumu === this.secilenDurum;
      return aramaUyumu && kategoriUyumu && durumUyumu;
    });
  }

  yeniDuyuru() {
    this.seciliDuyuru = null;
    this.form = { kategori: 'Genel', yayinDurumu: 'Taslak', onemli: false, hedef: 'Tümü', tarih: this.bugunTarih() };
    this.showModal = true;
  }

  duzenle(duyuru: Duyuru) {
    this.seciliDuyuru = duyuru;
    this.form = { ...duyuru };
    this.showModal = true;
  }

  detayGoster(duyuru: Duyuru) {
    this.seciliDuyuru = duyuru;
    this.showDetayModal = true;
  }

  kaydet() {
    if (this.seciliDuyuru) {
      const idx = this.duyurular.findIndex(d => d.id === this.seciliDuyuru!.id);
      if (idx > -1) this.duyurular[idx] = { ...this.seciliDuyuru, ...this.form } as Duyuru;
    } else {
      this.duyurular.unshift({ id: Date.now(), ...this.form } as Duyuru);
    }
    this.showModal = false;
    this.filtrele();
  }

  sil(id: number) {
    this.duyurular = this.duyurular.filter(d => d.id !== id);
    this.filtrele();
  }

  yayinaDonustur(duyuru: Duyuru) {
    const idx = this.duyurular.findIndex(d => d.id === duyuru.id);
    if (idx > -1) this.duyurular[idx].yayinDurumu = 'Yayında';
    this.filtrele();
  }

  bugunTarih(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  }

  kategoriRenk(kategori: string): string {
    switch (kategori) {
      case 'Acil': return 'danger';
      case 'Bakım': return 'warning';
      case 'Aidat': return 'primary';
      case 'Toplantı': return 'info';
      default: return 'success';
    }
  }

  kategoriIcon(kategori: string): string {
    switch (kategori) {
      case 'Acil': return 'ri-alarm-warning-line';
      case 'Bakım': return 'ri-tools-line';
      case 'Aidat': return 'ri-money-dollar-circle-line';
      case 'Toplantı': return 'ri-group-line';
      default: return 'ri-megaphone-line';
    }
  }

  toplamYayinda() { return this.duyurular.filter(d => d.yayinDurumu === 'Yayında').length; }
  toplamTaslak() { return this.duyurular.filter(d => d.yayinDurumu === 'Taslak').length; }
  toplamOnemli() { return this.duyurular.filter(d => d.onemli && d.yayinDurumu === 'Yayında').length; }
}
