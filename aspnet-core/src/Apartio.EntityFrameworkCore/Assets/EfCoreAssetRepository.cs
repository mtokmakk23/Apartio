using Apartio.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.Assets;

public class EfCoreAssetRepository : EfCoreRepository<ApartioDbContext, Asset, Guid>, IAssetRepository
{
    public EfCoreAssetRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public async Task<List<Asset>> GetListByHousingIdAsync(Guid housingId, CancellationToken cancellationToken = default)
    {
        var dbSet = await GetDbSetAsync();
        return await dbSet
            .Where(x => x.HousingId == housingId)
            .OrderByDescending(x => x.CreationTime)
            .ToListAsync(GetCancellationToken(cancellationToken));
    }

    public async Task<bool> ExistsCodeInHousingAsync(Guid housingId, string code, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var dbSet = await GetDbSetAsync();
        var normalizedCode = code.Trim().ToUpper();

        var query = dbSet
            .Where(x => x.HousingId == housingId && x.Code.ToUpper() == normalizedCode);

        if (excludeId.HasValue && excludeId.Value != Guid.Empty)
        {
            query = query.Where(x => x.Id != excludeId.Value);
        }

        return await query.AnyAsync(GetCancellationToken(cancellationToken));
    }

    public async Task<List<AssetMaintenanceLog>> GetLogsByAssetIdAsync(Guid assetId, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AssetMaintenanceLogs
            .Where(x => x.AssetId == assetId)
            .OrderByDescending(x => x.MaintenanceDate)
            .ToListAsync(GetCancellationToken(cancellationToken));
    }

    public async Task<AssetMaintenanceLog> InsertLogAsync(AssetMaintenanceLog log, bool autoSave = true, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        await dbContext.AssetMaintenanceLogs.AddAsync(log, GetCancellationToken(cancellationToken));
        if (autoSave)
        {
            await dbContext.SaveChangesAsync(GetCancellationToken(cancellationToken));
        }
        return log;
    }

    public async Task DeleteLogAsync(Guid logId, bool autoSave = true, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        var log = await dbContext.AssetMaintenanceLogs.FirstOrDefaultAsync(x => x.Id == logId, GetCancellationToken(cancellationToken));
        if (log != null)
        {
            dbContext.AssetMaintenanceLogs.Remove(log);
            if (autoSave)
            {
                await dbContext.SaveChangesAsync(GetCancellationToken(cancellationToken));
            }
        }
    }
}
