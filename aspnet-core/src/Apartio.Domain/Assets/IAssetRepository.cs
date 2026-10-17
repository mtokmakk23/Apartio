using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apartio.Assets;

public interface IAssetRepository : IRepository<Asset, Guid>
{
    Task<List<Asset>> GetListByHousingIdAsync(Guid housingId, CancellationToken cancellationToken = default);
    Task<List<Asset>> GetListAsync(
        Guid housingId,
        Guid? locationId = null,
        string? category = null,
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default);
    Task<bool> ExistsCodeInHousingAsync(Guid housingId, string code, Guid? excludeId = null, CancellationToken cancellationToken = default);
    Task<List<AssetMaintenanceLog>> GetLogsByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default);
    Task<AssetMaintenanceLog> InsertLogAsync(AssetMaintenanceLog log, bool autoSave = true, CancellationToken cancellationToken = default);
    Task DeleteLogAsync(Guid logId, bool autoSave = true, CancellationToken cancellationToken = default);
}
