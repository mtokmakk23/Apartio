import React, { useState, useEffect } from 'react';
import {
  Asset,
  CreateAssetInput,
  AssetCategory,
  AssetStatus,
  LocationOption,
  formatDate,
  toIsoDate
} from '../types/asset.types';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: CreateAssetInput, id?: string) => Promise<void>;
  initialData?: Asset | null;
  locationOptions?: LocationOption[];
}

const CATEGORIES: AssetCategory[] = [
  'Teknik',
  'Güvenlik',
  'Peyzaj',
  'Ortak Alan Mobilyası',
  'Temizlik',
  'Jeneratör & Enerji',
  'Asansör',
  'Diğer'
];

const STATUSES: AssetStatus[] = ['Aktif', 'Bakımda', 'Hurdaya Çıktı'];

const DEFAULT_LOCATIONS: LocationOption[] = [
  { id: 'loc-site-01', name: 'Güneş Sitesi (Ortak Alan)', type: 'Site' },
  { id: 'loc-block-a', name: 'A Blok', type: 'Blok' },
  { id: 'loc-block-b', name: 'B Blok', type: 'Blok' }
];

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  locationOptions = DEFAULT_LOCATIONS
}) => {
  const getTodayFormatted = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  };

  const [formData, setFormData] = useState<CreateAssetInput>({
    name: '',
    code: '',
    category: 'Teknik',
    location_id: locationOptions[0]?.id || '',
    location_type: locationOptions[0]?.type || '',
    location_detail: '',
    location: locationOptions[0]?.name || '',
    purchase_date: getTodayFormatted(),
    supplier: '',
    warranty_end_date: '',
    status: 'Aktif',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code,
        category: initialData.category,
        location_id: initialData.location_id || locationOptions[0]?.id || '',
        location_type: initialData.location_type || locationOptions[0]?.type || '',
        location_detail: initialData.location_detail || '',
        location: initialData.location,
        purchase_date: formatDate(initialData.purchase_date),
        supplier: initialData.supplier || '',
        warranty_end_date: initialData.warranty_end_date ? formatDate(initialData.warranty_end_date) : '',
        status: initialData.status,
        notes: initialData.notes || ''
      });
    } else {
      const defaultLoc = locationOptions[0];
      setFormData({
        name: '',
        code: '',
        category: 'Teknik',
        location_id: defaultLoc?.id || '',
        location_type: defaultLoc?.type || '',
        location_detail: '',
        location: defaultLoc?.name || '',
        purchase_date: getTodayFormatted(),
        supplier: '',
        warranty_end_date: '',
        status: 'Aktif',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleLocationChange = (locationId: string) => {
    const opt = locationOptions.find(o => o.id === locationId);
    if (!opt) return;
    const detail = formData.location_detail?.trim() || '';
    const fullLoc = detail ? `${opt.name} - ${detail}` : opt.name;
    setFormData({
      ...formData,
      location_id: opt.id,
      location_type: opt.type,
      location: fullLoc
    });
  };

  const handleDetailChange = (detail: string) => {
    const opt = locationOptions.find(o => o.id === formData.location_id);
    const baseName = opt ? opt.name : '';
    const fullLoc = detail.trim() ? `${baseName} - ${detail.trim()}` : baseName;
    setFormData({
      ...formData,
      location_detail: detail,
      location: fullLoc
    });
  };

  const handleDatePickerChange = (isoDate: string, field: 'purchase_date' | 'warranty_end_date') => {
    if (!isoDate) return;
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const formatted = `${parts[2]}.${parts[1]}.${parts[0]}`;
      setFormData(prev => ({ ...prev, [field]: formatted }));
    }
  };

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Demirbaş adı zorunludur.';
    if (!formData.code.trim()) err.code = 'Demirbaş kodu / barkodu zorunludur.';
    if (!formData.location_id) err.location_id = 'Lütfen bağlı olduğu yapı veya bloğu seçiniz.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave(formData, initialData?.id);
      onClose();
    } catch (err: any) {
      alert('Kayıt sırasında hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl transition-all">
        {/* Modal Başlığı */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-800">
            {initialData ? 'Demirbaş Bilgilerini Düzenle' : 'Yeni Demirbaş Kaydı Ekle'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form İçeriği */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Demirbaş Adı */}
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Demirbaş Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Örn: Asansör Motoru, 150 kVA Jeneratör"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Demirbaş Kodu */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Demirbaş Kodu / Barkod <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Örn: ASAN-01, JEN-02"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.code
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
            </div>

            {/* Kategori */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Kategori</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Bağlı Olduğu Yapı / Blok (GUID) */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Konum / Bağlı Olduğu Yapı veya Blok <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.location_id}
                onChange={e => handleLocationChange(e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.location_id
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              >
                {locationOptions.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} [{loc.type}]
                  </option>
                ))}
              </select>
            </div>

            {/* Konum Detayı / Mahal */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Konum Detayı / Mahal (Opsiyonel)
              </label>
              <input
                type="text"
                placeholder="Örn: Asansör Dairesi, Otopark -2"
                value={formData.location_detail || ''}
                onChange={e => handleDetailChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Durum */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Durum</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {STATUSES.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Tedarikçi / Yetkili Servis */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Tedarikçi / Yetkili Servis
              </label>
              <input
                type="text"
                placeholder="Örn: Kone Asansör A.Ş."
                value={formData.supplier || ''}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Alınış Tarihi (dd.MM.yyyy) */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Alınış Tarihi (dd.MM.yyyy)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="GG.AA.YYYY"
                  value={formData.purchase_date || ''}
                  onChange={e => setFormData({ ...formData, purchase_date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="date"
                  value={toIsoDate(formData.purchase_date)}
                  onChange={e => handleDatePickerChange(e.target.value, 'purchase_date')}
                  className="w-9 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-1 text-xs"
                  title="Takvimden Seç"
                />
              </div>
            </div>

            {/* Garanti Bitiş Tarihi (dd.MM.yyyy) */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Garanti Bitiş Tarihi (dd.MM.yyyy)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="GG.AA.YYYY"
                  value={formData.warranty_end_date || ''}
                  onChange={e => setFormData({ ...formData, warranty_end_date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="date"
                  value={toIsoDate(formData.warranty_end_date)}
                  onChange={e => handleDatePickerChange(e.target.value, 'warranty_end_date')}
                  className="w-9 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-1 text-xs"
                  title="Takvimden Seç"
                />
              </div>
            </div>

            {/* Notlar / Açıklama */}
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-700">Notlar / Açıklama</label>
              <textarea
                rows={3}
                placeholder="Demirbaş hakkında teknik özellikler, seri numarası veya kullanım notları..."
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Modal Butonları */}
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
