import { Component, OnInit } from '@angular/core';
import { Aidat } from '../aidat.model';

@Component({
  selector: 'app-aidat-list',
  templateUrl: './aidat-list.component.html',
  styleUrls: ['./aidat-list.component.scss']
})
export class AidatListComponent implements OnInit {

  aidatlar: Aidat[] = [
    { id: 1, daireNo: 'A-01', blok: 'A', sakinAdi: 'Ahmet Yılmaz', ay: 'Haziran', yil: 2026, tutar: 500, odemeTarihi: '05.06.2026', durum: 'Ödendi' },
    { id: 2, daireNo: 'A-02', blok: 'A', sakinAdi: 'Boş Daire', ay: 'Haziran', yil: 2026, tutar: 500, durum: 'Bekliyor' },
    { id: 3, daireNo: 'A-03', blok: 'A', sakinAdi: 'Fatma Demir', ay: 'Haziran', yil: 2026, tutar: 500, durum: 'Bekliyor' },
    { id: 4, daireNo: 'B-01', blok: 'B', sakinAdi: 'Mehmet Kaya', ay: 'Haziran', yil: 2026, tutar: 600, odemeTarihi: '03.06.2026', durum: 'Ödendi' },
    { id: 5, daireNo: 'B-02', blok: 'B', sakinAdi: 'Bakımda', ay: 'Haziran', yil: 2026, tutar: 600, durum: 'Bekliyor' },
    { id: 6, daireNo: 'C-01', blok: 'C', sakinAdi: 'Ayşe Çelik', ay: 'Haziran', yil: 2026, tutar: 550, durum: 'Gecikmiş' },
    { id: 7, daireNo: 'C-02', blok: 'C', sakinAdi: 'Ali Şahin', ay: 'Haziran', yil: 2026, tutar: 550, odemeTarihi: '01.06.2026', durum: 'Ödendi' },
    { id: 8, daireNo: 'D-01', blok: 'D', sakinAdi: 'Zeynep Arslan', ay: 'Haziran', yil: 2026, tutar: 500, durum: 'Gecikmiş' },
    { id: 9, daireNo: 'A-01', blok: 'A', sakinAdi: 'Ahmet Yılmaz', ay: 'Mayıs', yil: 2026, tutar: 500, odemeTarihi: '04.05.2026', durum: 'Ödendi' },
    { id: 10, daireNo: 'A-03', blok: 'A', sakinAdi: 'Fatma Demir', ay: 'Mayıs', yil: 2026, tutar: 500, odemeTarihi: '10.05.2026', durum: 'Ödendi' },
  ];

  filteredAidatlar: Aidat[] = [];
  aramaMetni: string = '';
  secilenAy: string = '';
  secilenDurum: string = '';
  secilenBlok: string = '';

  showModal: boolean = false;
  showOdemeModal: boolean = false;
  seciliAidat: Aidat | null = null;
  form: Partial<Aidat> = {};

  aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  durumlar = ['Ödendi', 'Bekliyor', 'Gecikmiş'];
  bloklar = ['A', 'B', 'C', 'D'];

  ngOnInit(): void {
    this.filtrele();
  }

  filtrele() {
    this.filteredAidatlar = this.aidatlar.filter(a => {
      const aramaUyumu = !this.aramaMetni ||
        a.daireNo.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        a.sakinAdi.toLowerCase().includes(this.aramaMetni.toLowerCase());
      const ayUyumu = !this.secilenAy || a.ay === this.secilenAy;
      const durumUyumu = !this.secilenDurum || a.durum === this.secilenDurum;
      const blokUyumu = !this.secilenBlok || a.blok === this.secilenBlok;
      return aramaUyumu && ayUyumu && durumUyumu && blokUyumu;
    });
  }

  odemeAl(aidat: Aidat) {
    this.seciliAidat = aidat;
    this.form = { ...aidat, odemeTarihi: this.bugunTarih(), durum: 'Ödendi' };
    this.showOdemeModal = true;
  }

  odemeKaydet() {
    if (this.seciliAidat) {
      const idx = this.aidatlar.findIndex(a => a.id === this.seciliAidat!.id);
      if (idx > -1) {
        this.aidatlar[idx] = { ...this.seciliAidat, ...this.form } as Aidat;
      }
    }
    this.showOdemeModal = false;
    this.filtrele();
  }

  yeniAidat() {
    this.seciliAidat = null;
    this.form = { ay: 'Haziran', yil: 2026, tutar: 500, durum: 'Bekliyor' };
    this.showModal = true;
  }

  kaydet() {
    if (this.seciliAidat) {
      const idx = this.aidatlar.findIndex(a => a.id === this.seciliAidat!.id);
      if (idx > -1) this.aidatlar[idx] = { ...this.seciliAidat, ...this.form } as Aidat;
    } else {
      this.aidatlar.push({ id: Date.now(), ...this.form } as Aidat);
    }
    this.showModal = false;
    this.filtrele();
  }

  bugunTarih(): string {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  }

  durumRenk(durum: string): string {
    switch (durum) {
      case 'Ödendi': return 'success';
      case 'Bekliyor': return 'warning';
      case 'Gecikmiş': return 'danger';
      default: return 'secondary';
    }
  }

  toplamOdenen() { return this.aidatlar.filter(a => a.durum === 'Ödendi').length; }
  toplamBekleyen() { return this.aidatlar.filter(a => a.durum === 'Bekliyor').length; }
  toplamGecikmis() { return this.aidatlar.filter(a => a.durum === 'Gecikmiş').length; }
  toplamTutar() { return this.aidatlar.filter(a => a.durum === 'Ödendi').reduce((s, a) => s + a.tutar, 0); }

  whatsappHatirlatma(aidat: Aidat) {
    const mesaj = `Sayın ${aidat.sakinAdi}, ${aidat.ay} ${aidat.yil} ayına ait ${aidat.tutar} ₺ tutarındaki aidatınız henüz ödenmemiştir. Lütfen en kısa sürede ödeme yapmanızı rica ederiz. Apartio Yönetimi`;
    const sakin = this.getSakinTelefon(aidat.daireNo);
    if (sakin) {
      const telefon = sakin.replace(/\s/g, '').replace(/^0/, '90');
      window.open(`https://wa.me/${telefon}?text=${encodeURIComponent(mesaj)}`, '_blank');
    } else {
      alert('Bu daire için telefon numarası bulunamadı.');
    }
  }

  smsHatirlatma(aidat: Aidat) {
    const mesaj = `Sayın ${aidat.sakinAdi}, ${aidat.ay} ${aidat.yil} aidatınız (${aidat.tutar} TL) ödenmemiştir. Apartio Yönetimi`;
    const sakin = this.getSakinTelefon(aidat.daireNo);
    if (sakin) {
      window.open(`sms:${sakin.replace(/\s/g, '')}?body=${encodeURIComponent(mesaj)}`, '_self');
    } else {
      alert('Bu daire için telefon numarası bulunamadı.');
    }
  }

  getSakinTelefon(daireNo: string): string | null {
    const telefonlar: any = {
      'A-01': '0532 111 22 33',
      'A-03': '0533 222 33 44',
      'B-01': '0534 333 44 55',
      'C-01': '0535 444 55 66',
      'C-02': '0536 555 66 77',
      'D-01': '0537 666 77 88',
    };
    return telefonlar[daireNo] || null;
  }
}
