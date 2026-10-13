using Apartio.Housings;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;

namespace Apartio.Assets;

[Authorize]
public class AssetAppService(
    IAssetRepository assetRepository,
    IHousingAppService housingAppService) : ApartioAppService, IAssetAppService
{
    public async Task<List<AssetDto>> GetListAsync()
    {
        var housing = await housingAppService.GetSelectedHousingAsync();
        if (housing == null)
        {
            return new List<AssetDto>();
        }

        var list = await assetRepository.GetListByHousingIdAsync(housing.Id);
        return list.Select(ObjectMapper.Map<Asset, AssetDto>).ToList();
    }

    public async Task<List<AssetDto>> GetListByHousingIdAsync(Guid housingId)
    {
        var list = await assetRepository.GetListByHousingIdAsync(housingId);
        return list.Select(ObjectMapper.Map<Asset, AssetDto>).ToList();
    }

    public async Task<AssetDto> GetAsync(Guid id)
    {
        var asset = await assetRepository.GetAsync(id);
        if (asset == null)
        {
            throw new UserFriendlyException("Demirbaş kaydı bulunamadı.");
        }

        return ObjectMapper.Map<Asset, AssetDto>(asset);
    }

    public async Task<AssetDto> CreateAsync(CreateOrUpdateAssetDto input)
    {
        ValidateInput(input);

        var housingId = input.HousingId ?? (await housingAppService.GetSelectedHousingAsync())?.Id;
        if (!housingId.HasValue || housingId.Value == Guid.Empty)
        {
            throw new UserFriendlyException("Seçili konut veya bina bulunamadı.");
        }

        // İŞ KURALI (Business Rule):
        // Demirbaş kodları veritabanı kısıtında değil, servis katmanında bina/housing bazında teklik kontrolüne tabi tutulur.
        var codeClean = input.Code.Trim();
        var isDuplicate = await assetRepository.ExistsCodeInHousingAsync(housingId.Value, codeClean);
        if (isDuplicate)
        {
            throw new UserFriendlyException($"'{codeClean}' kodu bu bina/yapı içerisinde zaten başka bir demirbaş için kullanılıyor! Farklı binalarda aynı kodu kullanabilirsiniz.");
        }

        var asset = ObjectMapper.Map<CreateOrUpdateAssetDto, Asset>(input);
        asset.HousingId = housingId.Value;
        asset.Code = codeClean.ToUpper();

        await assetRepository.InsertAsync(asset, autoSave: true);
        return ObjectMapper.Map<Asset, AssetDto>(asset);
    }

    public async Task<AssetDto> UpdateAsync(Guid id, CreateOrUpdateAssetDto input)
    {
        ValidateInput(input);

        var asset = await assetRepository.GetAsync(id);
        if (asset == null)
        {
            throw new UserFriendlyException("Güncellenecek demirbaş kaydı bulunamadı.");
        }

        var housingId = input.HousingId ?? asset.HousingId;
        if (housingId == Guid.Empty)
        {
            housingId = (await housingAppService.GetSelectedHousingAsync())?.Id ?? Guid.Empty;
        }

        if (housingId == Guid.Empty)
        {
            throw new UserFriendlyException("Seçili konut veya bina bulunamadı.");
        }

        // İŞ KURALI (Business Rule):
        // Güncellenen demirbaşın yeni kodu aynı bina içinde başka bir demirbaşta var mı kontrol edilir (kendi kaydı hariç).
        var codeClean = input.Code.Trim();
        var isDuplicate = await assetRepository.ExistsCodeInHousingAsync(housingId, codeClean, excludeId: id);
        if (isDuplicate)
        {
            throw new UserFriendlyException($"'{codeClean}' kodu bu bina/yapı içerisinde zaten başka bir demirbaş için kullanılıyor! Farklı binalarda aynı kodu kullanabilirsiniz.");
        }

        ObjectMapper.Map(input, asset);
        asset.HousingId = housingId;
        asset.Code = codeClean.ToUpper();

        await assetRepository.UpdateAsync(asset, autoSave: true);
        return ObjectMapper.Map<Asset, AssetDto>(asset);
    }

    public async Task DeleteAsync(Guid id)
    {
        var asset = await assetRepository.GetAsync(id);
        if (asset == null)
        {
            throw new UserFriendlyException("Silinecek demirbaş kaydı bulunamadı.");
        }

        await assetRepository.DeleteAsync(id, autoSave: true);
    }

    public async Task<List<AssetMaintenanceLogDto>> GetLogsAsync(Guid assetId)
    {
        var logs = await assetRepository.GetLogsByAssetIdAsync(assetId);
        return logs.Select(ObjectMapper.Map<AssetMaintenanceLog, AssetMaintenanceLogDto>).ToList();
    }

    public async Task<AssetMaintenanceLogDto> CreateLogAsync(CreateOrUpdateMaintenanceLogDto input)
    {
        if (string.IsNullOrWhiteSpace(input.Description))
        {
            throw new UserFriendlyException("Bakım açıklaması zorunludur.");
        }

        if (input.Cost < 0)
        {
            throw new UserFriendlyException("Maliyet tutarı negatif olamaz.");
        }

        var log = ObjectMapper.Map<CreateOrUpdateMaintenanceLogDto, AssetMaintenanceLog>(input);
        await assetRepository.InsertLogAsync(log, autoSave: true);
        return ObjectMapper.Map<AssetMaintenanceLog, AssetMaintenanceLogDto>(log);
    }

    public async Task DeleteLogAsync(Guid logId)
    {
        await assetRepository.DeleteLogAsync(logId, autoSave: true);
    }

    private static void ValidateInput(CreateOrUpdateAssetDto input)
    {
        if (string.IsNullOrWhiteSpace(input.Name))
        {
            throw new UserFriendlyException("Demirbaş adı zorunludur.");
        }

        if (string.IsNullOrWhiteSpace(input.Code))
        {
            throw new UserFriendlyException("Demirbaş kodu / barkodu zorunludur.");
        }

        if (input.LocationId == Guid.Empty)
        {
            throw new UserFriendlyException("Lütfen bağlı olduğu yapı veya bloğu seçiniz.");
        }
    }
}
