import React, { useState, useEffect, useMemo } from 'react';
import { Asset, AssetStatus, CreateAssetInput, formatDate } from '../types/asset.types';
import { assetService } from '../services/assetService';
import { AssetFormModal } from './AssetFormModal';
import { AssetDetailModal } from './AssetDetailModal';

export const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtreler
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modallar
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAssets();
      setAssets(data);
    } catch (err) {
      console.error('Demirbaşlar yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (assetData: CreateAssetInput, id?: string) => {
    if (id) {
      await assetService.updateAsset({ id, ...assetData });
    } else {
      await assetService.createAsset(assetData);
    }
    await loadAssets();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" demirbaşını silmek istediğinizden emin misiniz?`)) return;
    try {
      await assetService.deleteAsset(id);
      await loadAssets();
    } catch (err: any) {
      alert('Silme işlemi başarısız: ' + (err.message || 'Hata'));
    }
  };

  const openNewModal = () => {
    setSelectedAsset(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsFormModalOpen(true);
  };

  const openDetailModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailModalOpen(true);
  };

  // Filtreleme mantığı
  const filteredAssets = useMemo(() => {
    return assets.filter(item => {
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = !selectedCategory || item.category === selectedCategory;
      const matchStatus = !selectedStatus || item.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  // İstatistikler
  const totalCount = assets.length;
  const activeCount = assets.filter(a => a.status === 'Aktif').length;
  const inMaintenanceCount = assets.filter(a => a.status === 'Bakımda').length;
  const scrappedCount = assets.filter(a => a.status === 'Hurdaya Çıktı').length;

  const categories = Array.from(new Set(assets.map(a => a.category).filter(Boolean)));

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'Aktif':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Bakımda':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hurdaya Çıktı':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Sayfa Başlığı ve Yeni Ekle Butonu */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Demirbaş & Envanter Takibi
          </h1>
          <p className="text-sm text-gray-500">
            Apartman ve site demirbaşlarının operasyonel takibi, bakım geçmişi ve servis kayıtları.
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <span className="text-lg leading-none">+</span> Yeni Demirbaş Ekle
        </button>
      </div>

      {/* Özet İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Toplam Demirbaş
          </p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{totalCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Aktif Çalışan
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-600">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Bakımda</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">{inMaintenanceCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Hurdaya Çıkan
          </p>
          <p className="mt-2 text-3xl font-extrabold text-rose-600">{scrappedCount}</p>
        </div>
      </div>

      {/* Filtre ve Arama Çubuğu */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {/* Arama */}
          <div className="md:col-span-6">
            <input
              type="text"
              placeholder="Demirbaş adı, kodu veya konumunda ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Kategori Filtresi */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Durum Filtresi */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tüm Durumlar</option>
              <option value="Aktif">Aktif</option>
              <option value="Bakımda">Bakımda</option>
              <option value="Hurdaya Çıktı">Hurdaya Çıktı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demirbaş Tablosu */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/75 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Demirbaş Adı</th>
                <th className="px-6 py-4">Kod</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Konum</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Garanti Bitiş</th>
                <th className="px-6 py-4 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Demirbaşlar yükleniyor...
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Aranan kriterlere uygun demirbaş kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/75 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <button
                        onClick={() => openDetailModal(item)}
                        className="text-left hover:text-blue-600 transition"
                      >
                        {item.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.code}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(item.warranty_end_date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          title="Detay ve Bakım Geçmişi"
                        >
                          🔍 Detay / Bakım
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                          title="Düzenle"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                          title="Sil"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ekleme / Düzenleme Modalı */}
      <AssetFormModal
        isOpen={isFormModalOpen}
        initialData={selectedAsset}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleCreateOrUpdate}
      />

      {/* Detay & Bakım Modalı */}
      <AssetDetailModal
        isOpen={isDetailModalOpen}
        asset={selectedAsset}
        onClose={() => setIsDetailModalOpen(false)}
        onAssetUpdated={loadAssets}
      />
    </div>
  );
};
