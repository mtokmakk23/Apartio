import { Component, OnInit } from '@angular/core';
import { DuesTransactionService, CreateOrUpdateDuesTransaction } from '@proxy/dues-transactions';
import { HousingService, BlockDto, CircleDto, HousingDto } from '@proxy/housings';
import { FloorResidentService, FloorResidentDto } from '@proxy/floor-residents';
import { firstValueFrom } from 'rxjs';
import { DuesTransactionViewModel, AY_ISIMLERI } from '../dues-transaction.model';

export interface TahakkukGecmis {
  ay: number;
  yil: number;
  tutar: number;
  daireAdedi: number;
  tarih: string;
  tur: string;
}

@Component({
  selector: 'app-dues-transaction-list',
  templateUrl: './dues-transaction-list.component.html',
  styleUrls: ['./dues-transaction-list.component.scss']
})
export class DuesTransactionListComponent implements OnInit {

  islemler: DuesTransactionViewModel[] = [];
  filteredIslemler: DuesTransactionViewModel[] = [];

  bloklar: BlockDto[] = [];
  circles: CircleDto[] = [];
  floorResidents: FloorResidentDto[] = [];
  seciliHousing: HousingDto | null = null;

  aramaMetni: string = '';
  secilenAy: number | null = null;
  secilenBlok: string = '';

  showModal: boolean = false;
  seciliIslem: DuesTransactionViewModel | null = null;

  seciliIds: Set<string> = new Set();
  topluIslemYukleniyor: boolean = false;

  form: Partial<CreateOrUpdateDuesTransaction> = {};
  secilenModalBlok: string = '';

  // Toplu Tahakkuk
  showTahakkukModal: boolean = false;
  tahakkukForm = {
    ay: new Date().getMonth() + 1,
    yil: new Date().getFullYear(),
    tutar: 0,
    tur: 'Aidat',
    vadeTarihi: '',
    secilenBloklar: [] as string[],
    tumBloklar: true,
  };
  tahakkukYukleniyor: boolean = false;
  tahakkukSonuc: { basarili: number; hatali: number } | null = null;

  // Tahakkuk Geçmişi
  showGecmisModal: boolean = false;
  tahakkukGecmis: TahakkukGecmis[] = [];

  aylar = AY_ISIMLERI;
  loading: boolean = false;

  readonly BORC = 0;
  readonly ALACAK = 1;

  constructor(
    private duesTransactionService: DuesTransactionService,
    private housingService: HousingService,
    private floorResidentService: FloorResidentService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.verileriYukle();
  }

  async verileriYukle() {
    this.loading = true;
    this.seciliIds = new Set();
    try {
      this.seciliHousing = await firstValueFrom(this.housingService.getSelectedHousing());
      this.bloklar = await firstValueFrom(this.housingService.getBlockList());
      this.floorResidents = await firstValueFrom(this.floorResidentService.getFloorResidentList());

      let tumCircleler: CircleDto[] = [];
      for (const blok of this.bloklar) {
        if (!blok.id) continue;
        const circleList = await firstValueFrom(this.housingService.getCircleList(blok.id));
        tumCircleler = tumCircleler.concat(circleList);
      }
      this.circles = tumCircleler;

      const islemListesi = await firstValueFrom(this.duesTransactionService.getDuesTransactionList());
      this.islemler = islemListesi.map(i => this.zenginlestir(i));
      this.filtrele();
      this.tahakkukGecmisHesapla();
    } catch (err) {
      console.error('Veriler yuklenirken hata olustu:', err);
    } finally {
      this.loading = false;
    }
  }

  zenginlestir(islem: any): DuesTransactionViewModel {
    const circle = this.circles.find(c => c.id === islem.circleId);
    const sakin = this.floorResidents.find(f => f.id === islem.floorResidentId);
    return {
      ...islem,
      circleName: circle?.circleName,
      floorResidentName: sakin ? ((sakin.name ?? '') + ' ' + (sakin.surname ?? '')).trim() : undefined,
    };
  }

  filtrele() {
    this.filteredIslemler = this.islemler.filter(i => {
      const aramaUyumu = !this.aramaMetni ||
        (i.circleName || '').toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (i.floorResidentName || '').toLowerCase().includes(this.aramaMetni.toLowerCase());
      const ayUyumu = !this.secilenAy || i.month === this.secilenAy;
      const blokUyumu = !this.secilenBlok ||
        this.circles.find(c => c.id === i.circleId)?.blockId === this.secilenBlok;
      return aramaUyumu && ayUyumu && blokUyumu;
    });
  }

  // ---- Toplu seçim ----
  tumSecili(): boolean {
    return this.filteredIslemler.length > 0 &&
      this.filteredIslemler.every(i => i.id && this.seciliIds.has(i.id));
  }

  tumunuSec(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.filteredIslemler.forEach(i => { if (i.id) this.seciliIds.add(i.id); });
    } else {
      this.seciliIds = new Set();
    }
  }

  satirSec(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const yeni = new Set(this.seciliIds);
    if (checked) { yeni.add(id); } else { yeni.delete(id); }
    this.seciliIds = yeni;
  }

  seciliSayisi(): number { return this.seciliIds.size; }

  async topluOdendi() {
    if (this.seciliIds.size === 0) return;
    if (!confirm(this.seciliIds.size + ' kayit "Alacak (Odendi)" olarak isaretlenecek. Onayliyor musunuz?')) return;
    this.topluIslemYukleniyor = true;
    try {
      for (const id of Array.from(this.seciliIds)) {
        const islem = this.islemler.find(i => i.id === id);
        if (!islem) continue;
        const prop: CreateOrUpdateDuesTransaction = {
          housingId: islem.housingId || this.seciliHousing?.id,
          blockId: islem.blockId || undefined,
          circleId: islem.circleId || undefined,
          floorResidentId: islem.floorResidentId || undefined,
          price: islem.price || 0,
          month: islem.month || 1,
          year: islem.year || new Date().getFullYear(),
          date_: islem.date_ || new Date().toISOString().split('T')[0],
          delayCompensationRate: islem.delayCompensationRate || 0,
          type: islem.type || 'Aidat',
          sing: this.ALACAK,
          note: islem.note,
          dueDate: islem.dueDate || undefined,
        };
        await firstValueFrom(this.duesTransactionService.updateDuesTransaction(id, prop));
      }
      this.seciliIds = new Set();
      await this.verileriYukle();
    } catch (err) {
      console.error('Toplu islem hatasi:', err);
      alert('Toplu islem sirasinda bir hata olustu.');
    } finally {
      this.topluIslemYukleniyor = false;
    }
  }

  get filteredModalCircles() {
    if (!this.secilenModalBlok) return this.circles;
    return this.circles.filter(c => c.blockId === this.secilenModalBlok);
  }

  // ---- Tekil kayıt ----
  yeniIslem() {
    this.seciliIslem = null;
    const now = new Date();
    this.secilenModalBlok = '';
    this.form = {
      housingId: this.seciliHousing?.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      date_: now.toISOString().split('T')[0],
      sing: this.BORC,
      type: 'Aidat',
      price: 0,
      delayCompensationRate: 0,
    };
    this.showModal = true;
  }

  duzenle(islem: DuesTransactionViewModel) {
    this.seciliIslem = islem;
    this.secilenModalBlok = this.circles.find(c => c.id === islem.circleId)?.blockId || '';
    this.form = { ...islem };
    this.showModal = true;
  }

  async kaydet() {
    if (!this.form.housingId && !this.seciliHousing?.id) { alert('Secili bir site bulunamadi.'); return; }
    if (!this.form.price || this.form.price <= 0) { alert('Tutar 0dan buyuk olmalidir.'); return; }
    try {
      const now = new Date();
      const prop: CreateOrUpdateDuesTransaction = {
        housingId: this.form.housingId || this.seciliHousing?.id,
        blockId: this.form.blockId || undefined,
        circleId: this.form.circleId || undefined,
        floorResidentId: this.form.floorResidentId || undefined,
        price: this.form.price || 0,
        month: this.form.month || (now.getMonth() + 1),
        year: this.form.year || now.getFullYear(),
        date_: this.form.date_ || now.toISOString().split('T')[0],
        delayCompensationRate: this.form.delayCompensationRate || 0,
        type: this.form.type || 'Aidat',
        sing: this.form.sing ?? this.BORC,
        note: this.form.note,
        dueDate: this.form.dueDate || undefined,
      };
      if (this.seciliIslem && this.seciliIslem.id) {
        await firstValueFrom(this.duesTransactionService.updateDuesTransaction(this.seciliIslem.id, prop));
      } else {
        await firstValueFrom(this.duesTransactionService.createDuesTransaction(prop));
      }
      this.showModal = false;
      await this.verileriYukle();
    } catch (err) {
      console.error('Kaydetme hatasi:', err);
    }
  }

  async sil(id: string) {
    if (!confirm('Bu kaydi silmek istediginize emin misiniz?')) return;
    try {
      await firstValueFrom(this.duesTransactionService.deleteDuesTransaction(id));
      await this.verileriYukle();
    } catch (err) {
      console.error('Silme hatasi:', err);
    }
  }

  // ---- Toplu Tahakkuk ----
  tahakkukModalAc() {
    const now = new Date();
    this.tahakkukForm = {
      ay: now.getMonth() + 1,
      yil: now.getFullYear(),
      tutar: 0,
      tur: 'Aidat',
      vadeTarihi: '',
      secilenBloklar: [],
      tumBloklar: true,
    };
    this.tahakkukSonuc = null;
    this.showTahakkukModal = true;
  }

  tahakkukBlokToggle(blokId: string) {
    const idx = this.tahakkukForm.secilenBloklar.indexOf(blokId);
    if (idx >= 0) {
      this.tahakkukForm.secilenBloklar.splice(idx, 1);
    } else {
      this.tahakkukForm.secilenBloklar.push(blokId);
    }
  }

  tahakkukBlokSecili(blokId: string): boolean {
    return this.tahakkukForm.secilenBloklar.includes(blokId);
  }

  async tahakkukUygula() {
    if (!this.tahakkukForm.tutar || this.tahakkukForm.tutar <= 0) {
      alert('Tutar 0\'dan büyük olmalıdır.');
      return;
    }

    const hedefCircleler = this.tahakkukForm.tumBloklar
      ? this.circles
      : this.circles.filter(c => c.blockId && this.tahakkukForm.secilenBloklar.includes(c.blockId));

    if (hedefCircleler.length === 0) {
      alert('Tahakkuk uygulanacak daire bulunamadı.');
      return;
    }

    if (!confirm(hedefCircleler.length + ' daireye ' + this.tahakkukForm.tutar + ' TL tahakkuk uygulanacak. Onaylıyor musunuz?')) return;

    this.tahakkukYukleniyor = true;
    this.tahakkukSonuc = null;
    let basarili = 0;
    let hatali = 0;
    const now = new Date();

    for (const circle of hedefCircleler) {
      try {
        const prop: CreateOrUpdateDuesTransaction = {
          housingId: this.seciliHousing?.id,
          blockId: circle.blockId || undefined,
          circleId: circle.id || undefined,
          floorResidentId: circle.homeOwnerId || circle.hirerId || undefined,
          price: this.tahakkukForm.tutar,
          month: this.tahakkukForm.ay,
          year: this.tahakkukForm.yil,
          date_: now.toISOString().split('T')[0],
          delayCompensationRate: 0,
          type: this.tahakkukForm.tur,
          sing: this.BORC,
          note: this.tahakkukForm.ay + '/' + this.tahakkukForm.yil + ' ' + this.tahakkukForm.tur + ' tahakkuku',
          dueDate: this.tahakkukForm.vadeTarihi || undefined,
        };
        await firstValueFrom(this.duesTransactionService.createDuesTransaction(prop));
        basarili++;
      } catch (err) {
        hatali++;
      }
    }

    this.tahakkukSonuc = { basarili, hatali };
    this.tahakkukYukleniyor = false;
    await this.verileriYukle();
  }

  // ---- Tahakkuk Geçmişi ----
  tahakkukGecmisHesapla() {
    const gruplar = new Map<string, TahakkukGecmis>();
    for (const islem of this.islemler) {
      if (islem.sing !== this.BORC) continue;
      const anahtar = islem.month + '-' + islem.year + '-' + (islem.type || 'Aidat');
      if (!gruplar.has(anahtar)) {
        gruplar.set(anahtar, {
          ay: islem.month || 0,
          yil: islem.year || 0,
          tutar: islem.price || 0,
          daireAdedi: 1,
          tarih: islem.date_ || '',
          tur: islem.type || 'Aidat',
        });
      } else {
        const g = gruplar.get(anahtar)!;
        g.daireAdedi++;
      }
    }
    this.tahakkukGecmis = Array.from(gruplar.values())
      .sort((a, b) => b.yil - a.yil || b.ay - a.ay);
  }

  blokDaireSayisi(blokId: string): number {
    return this.circles.filter(c => c.blockId === blokId).length;
  }

  tahakkukHedefSayisi(): number {
    if (this.tahakkukForm.tumBloklar) return this.circles.length;
    return this.circles.filter(c => c.blockId && this.tahakkukForm.secilenBloklar.includes(c.blockId)).length;
  }

  gecmisModalAc() {
    this.tahakkukGecmisHesapla();
    this.showGecmisModal = true;
  }

  // ---- Yardımcı ----
  ayAdi(ay?: number): string { return ay ? (this.aylar[ay] || '') : ''; }

  tarihFormatla(tarih?: string): string {
    if (!tarih) return '—';
    const d = new Date(tarih);
    if (isNaN(d.getTime())) return tarih;
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
  }

  toplamBorc() { return this.islemler.filter(i => i.sing === this.BORC).reduce((s, i) => s + (i.price || 0), 0); }
  toplamAlacak() { return this.islemler.filter(i => i.sing === this.ALACAK).reduce((s, i) => s + (i.price || 0), 0); }
  toplamKayit() { return this.islemler.length; }
  singEtiketi(sing: number): string { return sing === this.BORC ? 'Borç' : 'Alacak'; }
  singRengi(sing: number): string { return sing === this.BORC ? 'danger' : 'success'; }

  whatsappHatirlatma(islem: DuesTransactionViewModel) {
    const sakin = this.floorResidents.find(f => f.id === islem.floorResidentId);
    if (!sakin?.phone) { alert('Bu kayit icin telefon numarasi bulunamadi.'); return; }
    const mesaj = 'Sayin ' + sakin.name + ' ' + sakin.surname + ', ' + this.ayAdi(islem.month) + ' ' + islem.year + ' ayina ait ' + islem.price + ' TL tutarindaki aidatinizla ilgili bilgilendirme. Apartio Yonetimi';
    const telefon = sakin.phone.replace(/\s/g, '').replace(/^0/, '90');
    window.open('https://wa.me/' + telefon + '?text=' + encodeURIComponent(mesaj), '_blank');
  }

  smsHatirlatma(islem: DuesTransactionViewModel) {
    const sakin = this.floorResidents.find(f => f.id === islem.floorResidentId);
    if (!sakin?.phone) { alert('Bu kayit icin telefon numarasi bulunamadi.'); return; }
    const mesaj = 'Sayin ' + sakin.name + ' ' + sakin.surname + ', ' + this.ayAdi(islem.month) + ' ' + islem.year + ' aidatiniz (' + islem.price + ' TL). Apartio Yonetimi';
    window.open('sms:' + sakin.phone.replace(/\s/g, '') + '?body=' + encodeURIComponent(mesaj), '_self');
  }
}
