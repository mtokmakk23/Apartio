-- ============================================================================
-- Apartio - Demirbaş ve Envanter Takip Modülü (Operational Asset Tracking)
-- Amortisman & Değer Düşüşü Hesaplamaları Barındırmayan Pratik Takip Şeması
-- Supabase PostgreSQL Migration
-- ============================================================================

-- UUID eklentisi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Otomatik updated_at tetikleyici fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. assets (Demirbaşlar) Tablosu
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    housing_id UUID NOT NULL, -- Apartman / Site / Rezidans / Villa GUID
    location_id UUID NOT NULL, -- Bağlı olduğu Housing veya Blok GUID
    location_type VARCHAR(50), -- 'Site', 'Apartman', 'Rezidans', 'Villa', 'Blok'
    location_detail VARCHAR(150), -- Asansör Dairesi, Çatı, Otopark -2 vb.
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    purchase_date DATE,
    supplier VARCHAR(255),
    warranty_end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Aktif' 
        CHECK (status IN ('Aktif', 'Bakımda', 'Hurdaya Çıktı')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
    -- Not: Kod teklik (uniqueness) kontrolü veritabanı kısıtı olarak değil, Backend iş kuralları (Business Rules) seviyesinde yönetilir.
);

-- updated_at Trigger
DROP TRIGGER IF EXISTS trigger_assets_updated_at ON public.assets;
CREATE TRIGGER trigger_assets_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Performans İndeksleri
CREATE INDEX IF NOT EXISTS idx_assets_housing_code ON public.assets(housing_id, code);
CREATE INDEX IF NOT EXISTS idx_assets_housing_id ON public.assets(housing_id);
CREATE INDEX IF NOT EXISTS idx_assets_location_id ON public.assets(location_id);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON public.assets(location);
CREATE INDEX IF NOT EXISTS idx_assets_warranty_end_date ON public.assets(warranty_end_date);

-- ----------------------------------------------------------------------------
-- 2. asset_maintenance_logs (Bakım ve Arıza Kayıtları) Tablosu
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.asset_maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    performed_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Bakım Kayıtları İndeksleri
CREATE INDEX IF NOT EXISTS idx_maintenance_asset_id ON public.asset_maintenance_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_date ON public.asset_maintenance_logs(maintenance_date DESC);

-- ----------------------------------------------------------------------------
-- 3. Row Level Security (RLS) Politikaları
-- ----------------------------------------------------------------------------
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Assets RLS (Giriş yapmış kullanıcılar okuyabilir, ekleyebilir, güncelleyebilir ve silebilir)
CREATE POLICY "Kullanıcılar demirbaşları görüntüleyebilir" 
    ON public.assets FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Kullanıcılar demirbaş ekleyebilir" 
    ON public.assets FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Kullanıcılar demirbaşları güncelleyebilir" 
    ON public.assets FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Kullanıcılar demirbaşları silebilir" 
    ON public.assets FOR DELETE 
    TO authenticated 
    USING (true);

-- Maintenance Logs RLS
CREATE POLICY "Kullanıcılar bakım kayıtlarını görüntüleyebilir" 
    ON public.asset_maintenance_logs FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Kullanıcılar bakım kaydı ekleyebilir" 
    ON public.asset_maintenance_logs FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Kullanıcılar bakım kayıtlarını güncelleyebilir" 
    ON public.asset_maintenance_logs FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Kullanıcılar bakım kayıtlarını silebilir" 
    ON public.asset_maintenance_logs FOR DELETE 
    TO authenticated 
    USING (true);

-- ----------------------------------------------------------------------------
-- 4. Örnek Başlangıç Verileri (Seed Data)
-- ----------------------------------------------------------------------------
INSERT INTO public.assets (id, housing_id, location_id, location_type, name, code, category, location, purchase_date, supplier, warranty_end_date, status, notes)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'b1111111-1111-1111-1111-111111111111', 'Blok', 'Ana Asansör Motoru (10 Kişilik)', 'ASAN-01', 'Teknik', 'A Blok - Asansör Dairesi', '2023-04-15', 'Kone Asansör Sanayi', '2027-04-15', 'Aktif', 'Yıllık yeşil etiket muayenesi yapıldı.'),
    ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Site', 'Ortak Alan Dizel Jeneratör (150 kVA)', 'JEN-01', 'Teknik', 'Site Ortak Alan - Otopark -2 Jen. Odası', '2022-09-10', 'Aksa Jeneratör', '2025-09-10', 'Aktif', 'Haftalık periyodik boşta çalışma testi yapılıyor.'),
    ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Apartman', 'Çevre Güvenlik Kamera Sistemi (16 Kanal NVR)', 'KAM-01', 'Güvenlik', 'Apartman Ortak Alan - Güvenlik Kulübesi', '2024-01-20', 'Hikvision Türkiye', '2026-01-20', 'Bakımda', '2 nolu kamera sinyal kaybı yaşıyor, kablo kontrolü yapılacak.'),
    ('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Site', 'Otomatik Bahçe Sulama Pompası', 'PEY-01', 'Peyzaj', 'Site Ortak Alan - Bahçe Su Deposu', '2021-06-01', 'Wilo Pompa Sistemleri', '2023-06-01', 'Hurdaya Çıktı', 'Motor sargısı yandı, yenisiyle değiştirildi.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.asset_maintenance_logs (asset_id, maintenance_date, description, cost, performed_by)
VALUES
    ('a1111111-1111-1111-1111-111111111111', '2024-03-10', 'Aylık periyodik yağlama, halat gergi kontrolü ve fren balata testi yapıldı.', 1850.00, 'Kone Yetkili Servis - Usta Murat'),
    ('a1111111-1111-1111-1111-111111111111', '2024-09-15', 'Hız regülatörü ayarı ve kapı kilit kontakları yenilendi.', 3400.00, 'Kone Yetkili Servis - Tekniker Can'),
    ('a2222222-2222-2222-2222-222222222222', '2024-05-20', 'Yağ filtresi, yakıt filtresi ve 40 lt motor yağı değişimi yapıldı.', 6200.00, 'Aksa Yetkili Servis'),
    ('a3333333-3333-3333-3333-333333333333', '2024-08-04', 'NVR 4TB Harddisk değişimi ve firmware güncellemesi.', 2100.00, 'Güvenlik Sistemleri Servisi')
ON CONFLICT DO NOTHING;
