import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // İstatistik kartları
  stats = [
    {
      title: 'Toplam Daire',
      value: '48',
      icon: 'ri-building-2-line',
      color: 'primary',
      bg: 'bg-primary-subtle',
      change: '+2 bu ay',
      changeType: 'up'
    },
    {
      title: 'Toplam Sakin',
      value: '124',
      icon: 'ri-group-line',
      color: 'success',
      bg: 'bg-success-subtle',
      change: '+5 bu ay',
      changeType: 'up'
    },
    {
      title: 'Bekleyen Aidat',
      value: '12',
      icon: 'ri-money-dollar-circle-line',
      color: 'warning',
      bg: 'bg-warning-subtle',
      change: '3 gecikmiş',
      changeType: 'down'
    },
    {
      title: 'Açık Talepler',
      value: '7',
      icon: 'ri-tools-line',
      color: 'danger',
      bg: 'bg-danger-subtle',
      change: '2 acil',
      changeType: 'down'
    }
  ];

  // Son duyurular
  announcements = [
    {
      title: 'Asansör Bakımı',
      date: '05 Haziran 2026',
      description: 'Asansör bakımı 10 Haziran Çarşamba günü yapılacaktır.',
      badge: 'Bakım',
      badgeColor: 'warning'
    },
    {
      title: 'Aidat Ödeme Hatırlatması',
      date: '01 Haziran 2026',
      description: 'Haziran ayı aidatlarının son ödeme tarihi 15 Haziran\'dır.',
      badge: 'Aidat',
      badgeColor: 'primary'
    },
    {
      title: 'Site Temizliği',
      date: '28 Mayıs 2026',
      description: 'Ortak alanların genel temizliği yapılmıştır.',
      badge: 'Genel',
      badgeColor: 'success'
    }
  ];

  // Son talepler
  requests = [
    {
      daire: 'D-12',
      konu: 'Su tesisatı arızası',
      tarih: '07 Haziran 2026',
      durum: 'Bekliyor',
      durumColor: 'warning'
    },
    {
      daire: 'A-05',
      konu: 'Kapı kilidi bozuk',
      tarih: '06 Haziran 2026',
      durum: 'İşlemde',
      durumColor: 'primary'
    },
    {
      daire: 'B-08',
      konu: 'Elektrik arızası',
      tarih: '05 Haziran 2026',
      durum: 'Tamamlandı',
      durumColor: 'success'
    },
    {
      daire: 'C-03',
      konu: 'Isıtma sorunu',
      tarih: '04 Haziran 2026',
      durum: 'Bekliyor',
      durumColor: 'warning'
    }
  ];

  // Aidat özeti
  aidatOzet = {
    toplam: 48,
    odenen: 36,
    bekleyen: 12,
    yuzde: 75
  };

  constructor() {}

  ngOnInit(): void {}
}
