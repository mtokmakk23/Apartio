import { Component, OnInit } from '@angular/core';
import { ExpenseModel, ButceModel, GIDER_KATEGORILERI, KASA_LISTESI } from '../expense.model';
import { HousingService, HousingDto } from '@proxy/housings';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
  giderler: ExpenseModel[] = [];
  filteredGiderler: ExpenseModel[] = [];
  seciliHousing: HousingDto | null = null;

  aramaMetni = '';
  secilenKategori = '';
  secilenDurum = '';

  showModal = false;
  seciliGider: ExpenseModel | null = null;
  validationHata = '';
  form: Partial<ExpenseModel> = {};

  seciliIds: Set<string> = new Set();

  showRaporModal = false;
  raporAy = new Date().getMonth() + 1;
  raporYil = new Date().getFullYear();

  showButceModal = false;
  butceler: ButceModel[] = [];
  butceForm: ButceModel = { kategori: '', butce: 0 };

  // Ödeme modal
  showOdemeModal = false;
  odemeGider: ExpenseModel | null = null;
  odemeForm = { tutar: 0, kasa: 'Nakit Kasa', tarih: '', aciklama: '' };

  readonly kategoriler = GIDER_KATEGORILERI;
  readonly kasalar = KASA_LISTESI;
  readonly aylar = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  constructor(private housingService: HousingService) {}

  async ngOnInit() {
    try { this.seciliHousing = await firstValueFrom(this.housingService.getSelectedHousing()); } catch {}
    this.verileriYukle();
    this.butceleriYukle();
    this.tekrarlayanGiderleriKontrolEt();
  }

  verileriYukle() {
    const key = 'expense_' + (this.seciliHousing?.id || 'default');
    const stored = localStorage.getItem(key);
    this.giderler = stored ? JSON.parse(stored) : [];
    // odenen alanı yoksa 0 yap
    this.giderler = this.giderler.map(g => ({ ...g, odenen: g.odenen || 0 }));
    this.filtrele();
  }

  kaydetLS() {
    const key = 'expense_' + (this.seciliHousing?.id || 'default');
    localStorage.setItem(key, JSON.stringify(this.giderler));
  }

  butceleriYukle() {
    const key = 'butce_' + (this.seciliHousing?.id || 'default');
    const stored = localStorage.getItem(key);
    this.butceler = stored ? JSON.parse(stored) : [];
  }

  butceleriKaydet() {
    const key = 'butce_' + (this.seciliHousing?.id || 'default');
    localStorage.setItem(key, JSON.stringify(this.butceler));
  }

  tekrarlayanGiderleriKontrolEt() {
    const now = new Date();
    const buAy = now.getMonth() + 1;
    const buYil = now.getFullYear();
    const tekrarlayan = this.giderler.filter(g => g.tekrarlayan);
    for (const t of tekrarlayan) {
      const sonTarih = new Date(t.tarih);
      const sonAy = sonTarih.getMonth() + 1;
      const sonYil = sonTarih.getFullYear();
      if (sonYil < buYil || (sonYil === buYil && sonAy < buAy)) {
        const buAyVar = this.giderler.some(g =>
          g.baslik === t.baslik &&
          new Date(g.tarih).getMonth() + 1 === buAy &&
          new Date(g.tarih).getFullYear() === buYil
        );
        if (!buAyVar) {
          const yeni: ExpenseModel = {
            ...t,
            id: Date.now().toString() + Math.random(),
            tarih: buYil + '-' + String(buAy).padStart(2, '0') + '-01',
            durum: 'Bekliyor',
            odenen: 0,
            odemeTarihi: undefined,
          };
          this.giderler.unshift(yeni);
        }
      }
    }
    this.kaydetLS();
  }

  filtrele() {
    this.filteredGiderler = this.giderler.filter(g => {
      const aramaUyumu = !this.aramaMetni ||
        g.baslik.toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (g.tedarikci || '').toLowerCase().includes(this.aramaMetni.toLowerCase()) ||
        (g.evrakNo || '').toLowerCase().includes(this.aramaMetni.toLowerCase());
      const kategoriUyumu = !this.secilenKategori || g.kategori === this.secilenKategori;
      const durumUyumu = !this.secilenDurum || g.durum === this.secilenDurum;
      return aramaUyumu && kategoriUyumu && durumUyumu;
    });
  }

  yeniGider() {
    this.seciliGider = null;
    this.validationHata = '';
    this.form = {
      tarih: new Date().toISOString().split('T')[0],
      durum: 'Bekliyor',
      kategori: 'Temizlik',
      kasa: 'Nakit Kasa',
      tutar: 0,
      odenen: 0,
      tekrarlayan: false,
      tekrarPeriyot: 'Aylık',
    };
    this.showModal = true;
  }

  duzenle(gider: ExpenseModel) {
    this.seciliGider = gider;
    this.validationHata = '';
    this.form = { ...gider };
    this.showModal = true;
  }

  onFaturaSecildi(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.faturaDosyasi = reader.result as string;
      this.form.faturaDosyasiAdi = file.name;
    };
    reader.readAsDataURL(file);
  }

  kaydet() {
    this.validationHata = '';
    if (!this.form.baslik?.trim()) { this.validationHata = 'Başlık zorunludur.'; return; }
    if (!this.form.tutar || this.form.tutar <= 0) { this.validationHata = 'Tutar 0\'dan büyük olmalıdır.'; return; }

    if (this.seciliGider) {
      const idx = this.giderler.findIndex(g => g.id === this.seciliGider!.id);
      if (idx >= 0) this.giderler[idx] = { ...this.seciliGider, ...this.form } as ExpenseModel;
    } else {
      const yeni: ExpenseModel = {
        ...this.form,
        id: Date.now().toString(),
        housingId: this.seciliHousing?.id,
        odenen: 0,
      } as ExpenseModel;
      this.giderler.unshift(yeni);
    }
    this.kaydetLS();
    this.filtrele();
    this.showModal = false;
  }

  sil(id: string) {
    if (!confirm('Bu gideri silmek istediğinize emin misiniz?')) return;
    this.giderler = this.giderler.filter(g => g.id !== id);
    this.kaydetLS();
    this.filtrele();
  }

  // Ödeme yap
  odemeAc(gider: ExpenseModel) {
    this.odemeGider = gider;
    this.odemeForm = {
      tutar: gider.tutar - (gider.odenen || 0),
      kasa: 'Nakit Kasa',
      tarih: new Date().toISOString().split('T')[0],
      aciklama: '',
    };
    this.showOdemeModal = true;
  }

  odemeKaydet() {
    if (!this.odemeGider) return;
    const idx = this.giderler.findIndex(g => g.id === this.odemeGider!.id);
    if (idx < 0) return;
    const g = this.giderler[idx];
    const yeniOdenen = (g.odenen || 0) + this.odemeForm.tutar;
    g.odenen = Math.min(yeniOdenen, g.tutar);
    g.kasa = this.odemeForm.kasa;
    g.odemeTarihi = this.odemeForm.tarih;
    if (g.odenen >= g.tutar) {
      g.durum = 'Ödendi';
    } else if (g.odenen > 0) {
      g.durum = 'Kısmi Ödendi';
    }
    this.kaydetLS();
    this.filtrele();
    this.showOdemeModal = false;
  }

  // Toplu seçim
  tumSecili(): boolean {
    return this.filteredGiderler.length > 0 &&
      this.filteredGiderler.every(g => this.seciliIds.has(g.id));
  }

  tumunuSec(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) { this.filteredGiderler.forEach(g => this.seciliIds.add(g.id)); }
    else { this.seciliIds = new Set(); }
  }

  satirSec(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const yeni = new Set(this.seciliIds);
    if (checked) { yeni.add(id); } else { yeni.delete(id); }
    this.seciliIds = yeni;
  }

  seciliSayisi() { return this.seciliIds.size; }

  topluOdendi() {
    if (!confirm(this.seciliIds.size + ' gider "Ödendi" olarak işaretlenecek. Onaylıyor musunuz?')) return;
    const now = new Date().toISOString().split('T')[0];
    this.giderler.forEach(g => {
      if (this.seciliIds.has(g.id)) {
        g.durum = 'Ödendi';
        g.odenen = g.tutar;
        g.odemeTarihi = now;
      }
    });
    this.seciliIds = new Set();
    this.kaydetLS();
    this.filtrele();
  }

  // Excel export
  excelExport() {
    const basliklar = ['Evrak No', 'Başlık', 'Kategori', 'Tedarikçi', 'Kasa', 'Borç', 'Ödenen', 'Kalan', 'Tarih', 'Vade', 'Durum', 'Açıklama'];
    const satirlar = this.filteredGiderler.map(g => [
      g.evrakNo || '',
      g.baslik,
      g.kategori,
      g.tedarikci || '',
      g.kasa || '',
      g.tutar,
      g.odenen || 0,
      g.tutar - (g.odenen || 0),
      this.tarihFormatla(g.tarih),
      this.tarihFormatla(g.vadeTarihi),
      g.durum,
      g.aciklama || '',
    ]);
    const csvIcerik = [basliklar, ...satirlar].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csvIcerik], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gider-listesi.csv';
    link.click();
  }

  // Bütçe
  butceAc() {
    this.butceForm = { kategori: this.kategoriler[0], butce: 0 };
    this.showButceModal = true;
  }

  butceKaydet() {
    const idx = this.butceler.findIndex(b => b.kategori === this.butceForm.kategori);
    if (idx >= 0) { this.butceler[idx].butce = this.butceForm.butce; }
    else { this.butceler.push({ ...this.butceForm, housingId: this.seciliHousing?.id }); }
    this.butceleriKaydet();
  }

  butceSil(kategori: string) {
    this.butceler = this.butceler.filter(b => b.kategori !== kategori);
    this.butceleriKaydet();
  }

  kategoriHarcama(kategori: string): number {
    return this.giderler.filter(g => g.kategori === kategori).reduce((s, g) => s + (g.tutar || 0), 0);
  }

  butceYuzdesi(kategori: string): number {
    const butce = this.butceler.find(b => b.kategori === kategori)?.butce || 0;
    if (!butce) return 0;
    return Math.min(100, Math.round((this.kategoriHarcama(kategori) / butce) * 100));
  }

  butceRengi(kategori: string): string {
    const yuzde = this.butceYuzdesi(kategori);
    if (yuzde >= 100) return 'danger';
    if (yuzde >= 75) return 'warning';
    return 'success';
  }

  // Rapor
  raporGosterData() {
    const ayStr = this.raporYil + '-' + String(this.raporAy).padStart(2, '0');
    const ayGiderler = this.giderler.filter(g => g.tarih?.startsWith(ayStr));
    const gruplar: { [k: string]: number } = {};
    for (const g of ayGiderler) {
      gruplar[g.kategori] = (gruplar[g.kategori] || 0) + g.tutar;
    }
    return Object.entries(gruplar).sort((a, b) => b[1] - a[1]);
  }

  raporToplamTutar() { return this.raporGosterData().reduce((s, [, v]) => s + v, 0); }

  raporBarYuzdesi(tutar: number): number {
    const toplam = this.raporToplamTutar();
    if (!toplam) return 0;
    return Math.round((tutar / toplam) * 100);
  }

  // Yardımcı
  kalan(g: ExpenseModel): number { return g.tutar - (g.odenen || 0); }
  toplamGider() { return this.giderler.reduce((s, g) => s + (g.tutar || 0), 0); }
  toplamOdenen() { return this.giderler.reduce((s, g) => s + (g.odenen || 0), 0); }
  toplamKalan() { return this.toplamGider() - this.toplamOdenen(); }
  bekleyenGider() { return this.giderler.filter(g => g.durum === 'Bekliyor').reduce((s, g) => s + (g.tutar || 0), 0); }

  durumRengi(durum: string): string {
    if (durum === 'Ödendi') return 'success';
    if (durum === 'Kısmi Ödendi') return 'warning';
    if (durum === 'İptal') return 'danger';
    return 'secondary';
  }

  tarihFormatla(tarih?: string): string {
    if (!tarih) return '—';
    const d = new Date(tarih);
    if (isNaN(d.getTime())) return tarih;
    return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
  }

  faturaIndir(gider: ExpenseModel) {
    if (!gider.faturaDosyasi) return;
    const link = document.createElement('a');
    link.href = gider.faturaDosyasi;
    link.download = gider.faturaDosyasiAdi || 'fatura';
    link.click();
  }
}
