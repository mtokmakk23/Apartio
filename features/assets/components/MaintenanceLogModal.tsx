import React, { useState } from 'react';
import { CreateMaintenanceLogInput, Asset, toIsoDate } from '../types/asset.types';

interface MaintenanceLogModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onSave: (logData: CreateMaintenanceLogInput) => Promise<void>;
}

export const MaintenanceLogModal: React.FC<MaintenanceLogModalProps> = ({
  isOpen,
  asset,
  onClose,
  onSave
}) => {
  const getTodayFormatted = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  };

  const [formData, setFormData] = useState<Omit<CreateMaintenanceLogInput, 'asset_id'>>({
    maintenance_date: getTodayFormatted(),
    description: '',
    cost: 0,
    performed_by: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !asset) return null;

  const handleDatePickerChange = (isoDate: string) => {
    if (!isoDate) return;
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      setFormData(prev => ({ ...prev, maintenance_date: `${parts[2]}.${parts[1]}.${parts[0]}` }));
    }
  };

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.description.trim()) err.description = 'Yapılan işlem / arıza açıklaması zorunludur.';
    if (formData.cost < 0) err.cost = 'Maliyet negatif olamaz.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        asset_id: asset.id,
        ...formData
      });
      onClose();
    } catch (err: any) {
      alert('Kayıt eklenirken hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Yeni Bakım / Servis Kaydı</h3>
            <p className="text-xs text-gray-500">
              {asset.name} ({asset.code})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* İşlem Tarihi */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">İşlem Tarihi (dd.MM.yyyy)</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="GG.AA.YYYY"
                  value={formData.maintenance_date}
                  onChange={e => setFormData({ ...formData, maintenance_date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="date"
                  value={toIsoDate(formData.maintenance_date)}
                  onChange={e => handleDatePickerChange(e.target.value)}
                  className="w-9 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-1 text-xs"
                  title="Takvimden Seç"
                />
              </div>
            </div>

            {/* Yapılan Bakım / Arıza Açıklaması */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Yapılan Bakım / Müdahale Açıklaması <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Örn: Yağ değişimi yapıldı, röle yenilendi, filtreler temizlendi..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Servis / Uygulayan Kişi veya Firma */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                İşlemi Yapan Servis / Yetkili
              </label>
              <input
                type="text"
                placeholder="Örn: Kone Yetkili Servis - Usta Murat"
                value={formData.performed_by || ''}
                onChange={e => setFormData({ ...formData, performed_by: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Bakım Masrafı */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Bakım Masrafı (₺) <span className="text-xs font-normal text-gray-500">(Operasyonel Harcama)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.cost}
                onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.cost && <p className="mt-1 text-xs text-red-500">{errors.cost}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydı Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
