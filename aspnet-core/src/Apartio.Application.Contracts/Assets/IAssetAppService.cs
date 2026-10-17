using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apartio.Assets;

public interface IAssetAppService : IApplicationService
{
    Task<List<AssetDto>> GetListAsync(GetAssetListInput? input = null);
    Task<List<AssetDto>> GetListByHousingIdAsync(Guid housingId);
    Task<AssetDto> GetAsync(Guid id);
    Task<AssetDto> CreateAsync(CreateOrUpdateAssetDto input);
    Task<AssetDto> UpdateAsync(Guid id, CreateOrUpdateAssetDto input);
    Task DeleteAsync(Guid id);

    Task<List<AssetMaintenanceLogDto>> GetLogsAsync(Guid assetId);
    Task<AssetMaintenanceLogDto> CreateLogAsync(CreateOrUpdateMaintenanceLogDto input);
    Task DeleteLogAsync(Guid logId);
}
