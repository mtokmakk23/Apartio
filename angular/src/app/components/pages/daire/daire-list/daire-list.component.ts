import { Component, OnInit } from '@angular/core';
import { Daire } from '../daire.model';
import { HousingService } from '@proxy/housings';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-daire-list',
  templateUrl: './daire-list.component.html',
  styleUrls: ['./daire-list.component.scss']
})
export class DaireListComponent implements OnInit {

  daireler: Daire[] = [
    { id: 1, daireNo: 'A-01', blok: 'A', kat: 1, tip: '2+1', metrekare: 85, durum: 'Dolu', sakinAdi: 'Ahmet Yılmaz', telefon: '0532 111 22 33' },
    { id: 2, daireNo: 'A-02', blok: 'A', kat: 1, tip: '3+1', metrekare: 110, durum: 'Boş' },
    { id: 3, daireNo: 'A-03', blok: 'A', kat: 2, tip: '1+1', metrekare: 60, durum: 'Dolu', sakinAdi: 'Fatma Demir', telefon: '0533 222 33 44' },
    { id: 4, daireNo: 'B-01', blok: 'B', kat: 1, tip: '2+1', metrekare: 90, durum: 'Dolu', sakinAdi: 'Mehmet Kaya', telefon: '0534 333 44 55' },
    { id: 5, daireNo: 'B-02', blok: 'B', kat: 2, tip: '3+1', metrekare: 120, durum: 'Bakımda' },
    { id: 6, daireNo: 'B-03', blok: 'B', kat: 3, tip: '2+1', metrekare: 85, durum: 'Boş' },
    { id: 7, daireNo: 'C-01', blok: 'C', kat: 1, tip: '1+1', metrekare: 55, durum: 'Dolu', sakinAdi: 'Ayşe Çelik', telefon: '0535 444 55 66' },
    { id: 8, daireNo: 'C-02', blok: 'C', kat: 2, tip: '2+1', metrekare: 80, durum: 'Dolu', sakinAdi: 'Ali Şahin', telefon: '0536 555 66 77' },
  ];

  filteredDaireler: Daire[] = [];
  aramaMetni: string = '';
  secilenBlok: string = '';
  secilenDurum: string = '';

  showModal: boolean = false;
  seciliDaire: Daire | null = null;
  silmeOnayModal: boolean = false;
  silinecekId: number | null = null;

  form: Partial<Daire> = {};

  bloklar = ['A', 'B', 'C', 'D'];
  tiplar = ['1+1', '2+1', '3+1', '4+1'];
  durumlar = ['Dolu', 'Boş', 'Bakımda'];

  constructor(private housingService:HousingService){}
  async ngOnInit(): Promise<void> {
    this.filtrele();
    await this.getCircleList();
  }

  getCircleList=async()=>{
  var list=await firstValueFrom(this.housingService.getCircleList(""));

  }

  filtrele() {
    this.filteredDaireler = this.daireler.filter(d => {
      const aramaUyumu = !this.aramaMetni ||
        d.daireNo.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (d.sakinAdi || '').toLowerCase().includes(this.aramaMetni.toLowerCase());
      const blokUyumu = !this.secilenBlok || d.blok === this.secilenBlok;
      const durumUyumu = !this.secilenDurum || d.durum === this.secilenDurum;
      return aramaUyumu && blokUyumu && durumUyumu;
    });
  }

  yeniDaireEkle() {
    this.seciliDaire = null;
    this.form = { durum: 'Boş' };
    this.showModal = true;
  }

  duzenle(daire: Daire) {
    this.seciliDaire = daire;
    this.form = { ...daire };
    this.showModal = true;
  }

  kaydet() {
    if (this.seciliDaire) {
      const idx = this.daireler.findIndex(d => d.id === this.seciliDaire!.id);
      if (idx > -1) this.daireler[idx] = { ...this.seciliDaire, ...this.form } as Daire;
    } else {
      const yeni: Daire = {
        id: Date.now(),
        daireNo: this.form.daireNo || '',
        blok: this.form.blok || '',
        kat: this.form.kat || 1,
        tip: this.form.tip || '2+1',
        metrekare: this.form.metrekare || 0,
        durum: this.form.durum || 'Boş',
        sakinAdi: this.form.sakinAdi,
        telefon: this.form.telefon
      };
      this.daireler.push(yeni);
    }
    this.showModal = false;
    this.filtrele();
  }

  silmeOnayla(id: number) {
    this.silinecekId = id;
    this.silmeOnayModal = true;
  }

  silmeOnayla2() {
    this.daireler = this.daireler.filter(d => d.id !== this.silinecekId);
    this.silmeOnayModal = false;
    this.filtrele();
  }

  durumRenk(durum: string): string {
    switch (durum) {
      case 'Dolu': return 'success';
      case 'Boş': return 'warning';
      case 'Bakımda': return 'danger';
      default: return 'secondary';
    }
  }

  toplamDolu() { return this.daireler.filter(d => d.durum === 'Dolu').length; }
  toplamBos() { return this.daireler.filter(d => d.durum === 'Boş').length; }
  toplamBakim() { return this.daireler.filter(d => d.durum === 'Bakımda').length; }
}
