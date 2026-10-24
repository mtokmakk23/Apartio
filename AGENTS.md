# Apartio — Agent & AI Guidelines (AGENTS.md)

Bu dosya, Apartio projesinde çalışan tüm yapay zeka asistanları (Antigravity, Cursor, GitHub Copilot, Claude, GPT vb.) için geçerli evrensel kural ve standart kılavuzudur. Projeye katkı sağlarken bu kurallara harfiyen uyulmalıdır.

---

## 1. Proje Mimarisi ve Teknoloji Yığını

- **Frontend:** `angular/` — Angular 18+, TypeScript (Strict mode), SCSS, Bootstrap 5 (Velzon UI teması), ABP Framework Angular SDK.
- **Backend:** `aspnet-core/` — .NET 8/9, C#, ABP Framework (Domain-Driven Design - DDD), Entity Framework Core, SQL Server, Redis.
- **Konut Hiyerarşisi:**
  `Housing` (Site / Tesis / Apartman) ➔ `Block` (Blok / Yapı) ➔ `Unit` (Bağımsız Bölüm / Daire / Dükkan / Ofis)

---

## 2. Katmanlı Mimari ve İş Kuralları (Business Rules Dağılımı)

### 2.1. Frontend (FE) — Minimum İş Kuralı
- Frontend yalnızca sunum (presentation), kullanıcı etkileşimi, yerel form durumları ve API entegrasyonu ile ilgilenmelidir.
- Hesaplama, karmaşık validasyon, durum geçişi veya yetkilendirme gibi **iş kuralları (business logic) frontend'de tutulmamalı**, minimum seviyede bırakılmalıdır.

### 2.2. Backend (BE) — İş Kurallarının Merkezi
- **Domain & Application Katmanı:** Tüm iş kuralları katmanlı mimariye (DDD) uygun şekilde `Application` servislerinde (örn. `HousingAppService`), `Domain` servislerinde veya Entity / Manager sınıflarında yer almalıdır.
- **Repository Katmanı:** `EntityFrameworkCore` veya custom repository katmanında **kesinlikle iş kuralı (business rule) bulunmamalıdır**. Repository'ler yalnızca veri sorgulama (query), ekleme/güncelleme/silme ve persistence operasyonlarından sorumlu olmalıdır.
- **API / Controller Katmanı:** Controller sınıfları ince (thin) kalmalı; iş mantığı içermemeli, gelen HTTP isteklerini doğrudan ilgili Application Service'e yönlendirmelidir.

---

## 3. Arayüz ve UI/UX Standartları (Kritik)

### 3.1. Tablo, Liste ve Sayfa İşlemleri (Action Buttons)
- **Yazılı Buton Standartı:** Tablolarda veya listelerdeki "İşlemler" (Actions) sütununda kesinlikle **yalnızca simgeden oluşan butonlar kullanılmamalıdır**.
- Butonlar her zaman ne işe yaradığını açıkça belirten metinler içermelidir (örn: `Düzenle`, `Sil`, `QR Kod`, `Detay`).
- Buton renkleri amaca uygun ve yumuşak tonlarda seçilmelidir (örn: `btn-soft-primary`, `btn-soft-danger`, `btn-soft-info`).
- **Tema Uyumluluğu:** Buton renkleri hem açık hem de koyu tema seçildiğinde rahatlıkla görünebilir, okunabilir ve yeterli kontrastı sağlayacak şekilde olmalıdır.

### 3.2. Kullanıcı Deneyimi (UI/UX) ve Hiyerarşik Veri Gösterimi
- **Temiz ve Zahmetsiz UI/UX:** Arayüzler modern, sade ve kullanıcının bilişsel yükünü (zorlanmasını) minimuma indirecek şekilde tasarlanmalıdır. Gereksiz tıklamalardan, karmaşık formlardan ve ekranı boğan kalabalık öğelerden kaçınılmalıdır.
- **Hiyerarşik / İlişkili Veriler:** Alt ilişkili veriler (örneğin siteye bağlı bloklar veya bloğa bağlı bağımsız bölümler) listelenirken ekranı daraltan bölünmüş yan paneller yerine duruma göre satır içi **akordeon (genişleyen satır)** veya bağlama uygun temiz bir kart/liste düzeni tercih edilebilir. Akordeon her bileşende zorunlu değil; hiyerarşik veriler için tavsiye edilen pratik bir gösterim seçeneğidir.
- **Akordeon Kullanıldığında:**
  - Satır tıklamasıyla açılıp kapanabilmeli, satır üzerindeki butonlarda `$event.stopPropagation()` eksiksiz kullanılmalıdır.
  - Varsa alt eleman sayıları (örn: `[X Blok]`) kullanıcının içeriğe girmeden fikir edinebilmesi için başlangıçta görünür olmalıdır.
- **Hızlı ve Net Geri Bildirim:** Asenkron işlemlerde (kaydetme, silme, yükleme) spinner/loading göstergeleri sunulmalı ve mükerrer tıklamaları engellemek için butonlar işlem süresince devre dışı bırakılmalıdır.

### 3.3. Çalışma Alanı / Aktif Site Yönetimi
- Kullanıcının aktif çalıştığı site/tesis seçimi **yalnızca Topbar'daki site seçici** üzerinden yapılmalıdır.
- Tablolarda "Aktif Yap" gibi mükerrer butonlar bulundurulmamalıdır.
- Yeni bir site eklendiğinde, güncellendiğinde veya silindiğinde mutlaka `EventService.broadcast('housingChanged')` tetiklenmeli ve üst menüdeki liste anında güncellenmelidir.

---

## 4. Kod Kalitesi ve Temizlik Standartları

### 4.1. Konsol Çıktıları Yasaktır
- Kod tabanında (özellikle Angular TypeScript/JavaScript dosyalarında) **kesinlikle `console.log`, `console.error`, `console.warn` veya geçici test logları bırakılmamalıdır**.
- Hata durumları uygun UI bildirimleriyle (uyarı kutusu, toast bildirimi, form hata mesajı) kullanıcıya aktarılmalı ya da sessizce ele alınmalıdır.

### 4.2. Strong Types ve Modern Yapı
- Mümkün olan her yerde strong types (`HousingDto`, `BlockDto`, `UnitDto` vb.) kullanılmalı, zorunlu olmadıkça `any` kullanımından kaçınılmalıdır.
- Asenkron veri çağrılarında modern RxJS `firstValueFrom` yaklaşımı tercih edilmelidir.
- Servis abonelikleri (`EventService`, `Subscription`) bileşen yok edilirken (`ngOnDestroy`) temizlenmelidir.

### 4.3. Kullanılmayan Import ve Using Direktifleri Yasaktır
- **Frontend (Angular / TypeScript):** Dosyalarda kullanılmayan hiçbir `import` ifadesi (unused imports), atıl değişken veya enjeksiyon bırakılmamalı; kod düzenleme sonrasında temizlenmelidir.
- **Backend (.NET / C#):** Sınıflarda kullanılmayan `using` direktifleri (unused usings) kaldırılmalı; dosya başında gereksiz kütüphane referansı bulundurulmamalıdır.

---

## 5. Modern C# ve Backend Standartları (.NET 8 / C# 12)

- **Biçimlendirme & `.editorconfig`:** Tüm dosyalar `CRLF` satır sonuna sahip olmalıdır. İndentasyon tab yerine `space` kullanılmalı; C# dosyalarında `4 space`, JSON / appsettings dosyalarında `2 space` uygulanmalıdır.
- **File-Scoped Namespaces:** C# dosyalarında blok parantezli namespace yerine `namespace Apartio.Housing;` şeklinde file-scoped namespace kullanılmalıdır.
- **Primary Constructors:** Servis ve Dependency Injection tanımlarında `class HousingAppService(IHousingRepository repository) : ApplicationService` sözdizimi tercih edilmelidir.
- **Collection Expressions:** `new List<T>()` veya `Array.Empty<T>()` yerine `[]` kullanılmalıdır.
- **Null Kontrolleri:** `== null` yerine `is null` / `is not null`; metot başı parametre kontrollerinde `ArgumentNullException.ThrowIfNull()` kullanılmalıdır.
- **DTO ve Değişmezlik (Immutability):** DTO ve Value Object tanımlarında `record` ve `init;` özellikleri tercih edilmelidir.
- **Asenkron Metotlar ve `Async` Soneki:**
  - ABP Framework, Auto API Controllers mekanizmasıyla REST rotalarını ve Angular proxy üretimini `Async` soneki kuralına göre yönetir (örn: `GetListAsync` ➔ `/api/app/housing`).
  - API ve proxy uyumluluğu için backend asenkron metotlarında `Async` soneki korunmalı ve sorgulara `CancellationToken cancellationToken = default` iletilmelidir.
- **Uygun Veri Tipleri (Domain-Driven Data Types):**
  - Entity ve DTO alanlarında alışkanlıkla doğrudan `int`, `long` veya `double` kullanılmamalı; domainin gerçek sınırlarına ve saklama verimliliğine uygun veri tipleri seçilmelidir:
    - Küçük sayımlar için `byte` (SQL Server'da `tinyint`, 0-255).
    - Orta büyüklükteki sayımlar veya aralıklar için `short` (SQL Server'da `smallint`, -32.768..32.767).
    - Alan (m²), ağırlık veya finansal/parasal tutarlar için `float`/`double` yerine hassasiyeti belirlenmiş `decimal(p,s)` (örn: `decimal(6,2)` veya `decimal(18,2)`).

---

## 6. Geliştirme ve Derleme Güvenliği

- **Angular Doğrulama:** Arayüz değişiklikleri sonrasında `npx ng build --configuration development` çalıştırılarak derleme ve tip hataları doğrulanmalıdır.
- **Backend Kilitleri (.NET):** Backend servisi (`Apartio.HttpApi.Host` veya `dotnet run`) arka planda çalışırken gereksiz derleme (`dotnet build`) başlatılmamalıdır (Windows dosya kilidi `MSB3026` hatasını önlemek için).
