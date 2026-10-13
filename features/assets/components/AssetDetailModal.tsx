import React, { useState, useEffect } from 'react';
import { Asset, AssetMaintenanceLog, CreateMaintenanceLogInput, formatDate } from '../types/asset.types';
import { assetService } from '../services/assetService';
import { MaintenanceLogModal } from './MaintenanceLogModal';

interface AssetDetailModalProps {
  isOpen: boolean;
  asset: Asset | null;
  onClose: () => void;
  onAssetUpdated?: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  isOpen,
  asset,
  onClose,
  onAssetUpdated
}) => {
  const [logs, setLogs] = useState<AssetMaintenanceLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    if (asset && isOpen) {
      loadLogs(asset.id);
    }
  }, [asset, isOpen]);

  const loadLogs = async (assetId: string) => {
    try {
      setLoadingLogs(true);
      const data = await assetService.getMaintenanceLogs(assetId);
      setLogs(data);
    } catch (err) {
      console.error('Bakım kayıtları yüklenemedi:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSaveLog = async (logData: CreateMaintenanceLogInput) => {
    await assetService.createMaintenanceLog(logData);
    if (asset) {
      await loadLogs(asset.id);
    }
    if (onAssetUpdated) onAssetUpdated();
  };

  const handleDeleteLog = async (logId: string) => {
    if (!window.confirm('Bu bakım kaydını silmek istediğinizden emin misiniz?')) return;
    await assetService.deleteMaintenanceLog(logId);
    if (asset) {
      await loadLogs(asset.id);
    }
  };

  if (!isOpen || !asset) return null;

  const totalMaintenanceCost = logs.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Bakımda':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hurdaya Çıktı':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">{asset.name}</h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                    asset.status
                  )}`}
                >
                  {asset.status}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500">
                Kod: <span className="font-mono text-gray-700">{asset.code}</span> • Kategori:{' '}
                <span className="text-gray-700">{asset.category}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Demirbaş Künyesi */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">
            <div>
              <span className="text-xs font-medium text-gray-500">Konum / Blok</span>
              <p className="text-sm font-semibold text-gray-800">{asset.location || '—'}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Tedarikçi / Servis</span>
              <p className="text-sm font-semibold text-gray-800">{asset.supplier || '—'}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Alınış Tarihi</span>
              <p className="text-sm font-semibold text-gray-800">
                {formatDate(asset.purchase_date)}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Garanti Bitiş</span>
              <p className="text-sm font-semibold text-gray-800">
                {formatDate(asset.warranty_end_date)}
              </p>
            </div>
            {asset.notes && (
              <div className="col-span-2 sm:col-span-4 border-t border-gray-200/60 pt-2 mt-1">
                <span className="text-xs font-medium text-gray-500">Notlar & Açıklama</span>
                <p className="text-sm text-gray-700 italic">{asset.notes}</p>
              </div>
            )}
          </div>

          {/* Bakım ve Müdahale Geçmişi Bölümü */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-gray-800">
                  Bakım ve Arıza Müdahale Geçmişi
                </h4>
                <p className="text-xs text-gray-500">
                  Toplam Bakım Harcaması:{' '}
                  <span className="font-semibold text-emerald-600">
                    {totalMaintenanceCost.toLocaleString('tr-TR')} ₺
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700"
              >
                <span>+</span> Yeni Bakım / Servis Kaydı Ekle
              </button>
            </div>

            {loadingLogs ? (
              <div className="py-8 text-center text-sm text-gray-500">Kayıtlar yükleniyor...</div>
            ) : logs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
                Bu demirbaşa ait henüz bakım veya arıza kaydı bulunmuyor.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                    <tr>
                      <th className="px-4 py-3">İşlem Tarihi</th>
                      <th className="px-4 py-3">Yapılan Bakım / Müdahale</th>
                      <th className="px-4 py-3">Servis / Yetkili</th>
                      <th className="px-4 py-3 text-right">Masraf</th>
                      <th className="px-4 py-3 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-700">
                          {formatDate(log.maintenance_date)}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{log.description}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                          {log.performed_by || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-emerald-700">
                          {(Number(log.cost) || 0).toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="rounded p-1 text-gray-400 hover:text-red-600"
                            title="Kaydı Sil"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Kapat
          </button>
        </div>
      </div>

      {/* Yeni Bakım Kaydı Modalı */}
      <MaintenanceLogModal
        isOpen={showLogModal}
        asset={asset}
        onClose={() => setShowLogModal(false)}
        onSave={handleSaveLog}
      />
    </div>
  );
};
