using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;

namespace Apartio.Housings;

[Authorize]
public class HousingService(
    IHousingRepository housingRepository,
    IUserMatchHousingRepository userMatchHousingRepository,
    IMemoryCache cache,
    IBlockRepository blockRepository,
    ICircleRepository circleRepository,
    IUnitRepository unitRepository,
    IHousingTypeRepository housingTypeRepository) : ApartioAppService, IHousingAppService
{
    public async Task CreateHousingAsync(CreateOrUpdateHousing prop)
    {
        var property = new Housing(prop.Name, prop.City, prop.Town, prop.Type, prop.Adress, prop.PostalCode, prop.Email, prop.Phone, prop.IsDelayCompensation, prop.DelayCompensationRate, prop.LastPaymentDay);
        await housingRepository.InsertAsync(property, autoSave: true);
    }

    public async Task DeleteAsync(Guid id)
    {
        var property = await housingRepository.GetAsync(id);
        await housingRepository.DeleteAsync(property, autoSave: true);
    }

    public async Task<HousingDto> GetAsync(Guid id)
    {
        var housingQuery = await housingRepository.GetQueryableAsync();
        var typeQuery = await housingTypeRepository.GetQueryableAsync();

        var query = from h in housingQuery
                    join t in typeQuery on h.Type equals t.Id into types
                    from t in types.DefaultIfEmpty()
                    where h.Id == id
                    select new HousingDto
                    {
                        Id = h.Id,
                        Name = h.Name,
                        City = h.City,
                        Town = h.Town,
                        Adress = h.Adress,
                        PostalCode = h.PostalCode,
                        Email = h.Email,
                        Phone = h.Phone,
                        Type = h.Type,
                        TypeName = t != null ? t.Name : null,
                        IsDelayCompensation = h.IsDelayCompensation,
                        DelayCompensationRate = h.DelayCompensationRate,
                        LastPaymentDay = h.LastPaymentDay
                    };

        var result = await AsyncExecuter.FirstOrDefaultAsync(query);
        return result ?? throw new UserFriendlyException("Konut bulunamadı!");
    }

    public async Task<List<HousingDto>> GetListAsync()
    {
        var housingQuery = await housingRepository.GetQueryableAsync();
        var typeQuery = await housingTypeRepository.GetQueryableAsync();

        var query = from h in housingQuery
                    join t in typeQuery on h.Type equals t.Id into types
                    from t in types.DefaultIfEmpty()
                    select new HousingDto
                    {
                        Id = h.Id,
                        Name = h.Name,
                        City = h.City,
                        Town = h.Town,
                        Adress = h.Adress,
                        PostalCode = h.PostalCode,
                        Email = h.Email,
                        Phone = h.Phone,
                        Type = h.Type,
                        TypeName = t == null ? null : t.Name,
                        IsDelayCompensation = h.IsDelayCompensation,
                        DelayCompensationRate = h.DelayCompensationRate,
                        LastPaymentDay = h.LastPaymentDay
                    };

        return await AsyncExecuter.ToListAsync(query);
    }

    public async Task<List<HousingTypeDto>> GetHousingTypeListAsync()
    {
        var list = await housingTypeRepository.GetListAsync();
        return ObjectMapper.Map<List<HousingType>, List<HousingTypeDto>>(list);
    }

    public async Task UpdateHousingAsync(Guid id, CreateOrUpdateHousing prop)
    {
        var property = await housingRepository.GetAsync(id);
        property.setAdress(prop.Adress);
        property.setCity(prop.City);
        property.setEmail(prop.Email);
        property.setName(prop.Name);
        property.setPhone(prop.Phone);
        property.setPostalCode(prop.PostalCode);
        property.setTown(prop.Town);
        property.setType(prop.Type);
        property.setIsDelayCompensation(prop.IsDelayCompensation);
        property.setDelayCompensationRate(prop.DelayCompensationRate);
        property.LastPaymentDay = prop.LastPaymentDay;

        await housingRepository.UpdateAsync(property, autoSave: true);
    }

    public async Task ChangeHousingAsync(Guid housingId)
    {
        var cacheKey = $"user:{CurrentUser.Id}";
        var housing = await housingRepository.GetListAsync(x => x.Id == housingId);
        if (housing.Count > 0)
        {
            var userMatchHousing = await userMatchHousingRepository.GetListAsync(x => x.UserId == CurrentUser.Id);
            if (userMatchHousing.Count > 0)
            {
                var prop = userMatchHousing[0];
                prop.HousingId = housingId;
                await userMatchHousingRepository.UpdateAsync(prop, autoSave: true);
                cache.Remove(cacheKey);
            }
            else
            {
                var currentUser = CurrentUser.Id is null ? Guid.Empty : (Guid)CurrentUser.Id;
                var newUserMatchHousing = new UserMatchHousing(currentUser, housingId);
                await userMatchHousingRepository.InsertAsync(newUserMatchHousing, autoSave: true);
                cache.Remove(cacheKey);
            }
        }
        else throw new UserFriendlyException("Konut Bulunamadı!");
    }

    public async Task<HousingDto> GetSelectedHousingAsync()
    {
        var currentUserId = CurrentUser.Id is null ? Guid.Empty : (Guid)CurrentUser.Id;
        var cacheKey = $"user:{currentUserId}";

        // 1. CACHE CHECK
        if (cache.TryGetValue(cacheKey, out HousingDto? prop))
        {
            return prop ?? new();
        }

        HousingDto _prop;
        // 2. DB FETCH
        var userMatchHousing = await userMatchHousingRepository.GetListAsync(x => x.UserId == CurrentUser.Id);
        if (userMatchHousing.Count > 0)
        {
            _prop = await GetAsync(userMatchHousing[0].HousingId);
        }
        else
        {
            _prop = (await GetListAsync()).FirstOrDefault() ?? new();
        }

        if (_prop == null)
            return new();

        // 3. CACHE WRITE
        cache.Set(cacheKey, _prop, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
            SlidingExpiration = TimeSpan.FromMinutes(2)
        });

        return _prop;
    }

    public async Task<List<BlockDto>> GetBlockListAsync()
    {
        var housing = await GetSelectedHousingAsync();
        return ObjectMapper.Map<List<Block>, List<BlockDto>>(await blockRepository.GetListAsync(x => x.HousingId == housing.Id));
    }

    public async Task DeleteBlock(Guid id)
    {
        var block = await blockRepository.GetAsync(id);
        await blockRepository.DeleteAsync(block, autoSave: true);
    }

    public async Task CreateBlockAsync(CreateOrUpdateBlock prop)
    {
        var housing = await GetSelectedHousingAsync();
        var block = new Block(housing.Id, prop.BlockName, prop.ElevatorCount, prop.TotalFloors);
        await blockRepository.InsertAsync(block, autoSave: true);
    }

    public async Task UpdateBlockAsync(Guid id, CreateOrUpdateBlock prop)
    {
        var block = await blockRepository.GetAsync(id);
        block.SetBlockName(prop.BlockName);
        block.SetElevatorCount(prop.ElevatorCount);
        block.SetTotalFloors(prop.TotalFloors);
        await blockRepository.UpdateAsync(block, autoSave: true);
    }

    public async Task UpdateCircleAsync(Guid id, CreateOrUpdateCircle prop)
    {
        var circle = await circleRepository.GetAsync(id);
        circle.SetCircleName(prop.CircleName);
        circle.BlockId = prop.BlockId;
        circle.HomeOwnerId = prop.HomeOwnerId;
        circle.HirerId = prop.HirerId;
        await circleRepository.UpdateAsync(circle, autoSave: true);
    }

    public async Task CreateCircleAsync(CreateOrUpdateCircle prop)
    {
        var circle = new Circle(prop.BlockId, prop.CircleName, prop.HomeOwnerId, prop.HirerId);
        await circleRepository.InsertAsync(circle, autoSave: true);
    }

    public async Task DeleteCircle(Guid id)
    {
        var circle = await circleRepository.GetAsync(id);
        await circleRepository.DeleteAsync(circle, autoSave: true);
    }

    public async Task<List<CircleDto>> GetCircleListAsync(Guid blockId)
    {
        var circleQuery = await circleRepository.GetQueryableAsync();
        var blockQuery = await blockRepository.GetQueryableAsync();
        var housing = await GetSelectedHousingAsync();

        var circles = from c in circleQuery
                      join b in blockQuery on c.BlockId equals b.Id
                      where b.HousingId == housing.Id && c.BlockId == blockId
                      select c;
        return ObjectMapper.Map<List<Circle>, List<CircleDto>>([.. circles]);
    }

    public async Task CreateUnitAsync(CreateOrUpdateUnit prop)
    {
        ArgumentNullException.ThrowIfNull(prop);

        var block = await blockRepository.FindAsync(prop.BlockId);
        var unit = new Unit(
            prop.BlockId,
            string.IsNullOrWhiteSpace(prop.UnitNumber) ? prop.CircleName : prop.UnitNumber, prop.Floor,
            prop.HomeOwnerId,
            prop.HirerId,
            prop.UnitType,
            prop.GrossSquareMeters,
            prop.NetSquareMeters,
            block?.TotalFloors);
        await unitRepository.InsertAsync(unit, autoSave: true);
    }

    public async Task CreateBulkUnitsAsync(CreateBulkUnitsDto prop)
    {
        ArgumentNullException.ThrowIfNull(prop);

        if (prop.Units is null || prop.Units.Count == 0)
        {
            throw new UserFriendlyException("Eklenecek bağımsız bölüm listesi boş olamaz!");
        }

        var block = await blockRepository.FindAsync(prop.BlockId);
        var maxFloors = block?.TotalFloors;

        var units = prop.Units.Select(x => new Unit(
            prop.BlockId,
            string.IsNullOrWhiteSpace(x.UnitNumber) ? x.CircleName : x.UnitNumber,
            x.Floor,
            x.HomeOwnerId,
            x.HirerId,
            x.UnitType,
            x.GrossSquareMeters,
            x.NetSquareMeters,
            maxFloors)).ToList();

        await unitRepository.InsertManyAsync(units, autoSave: true);
    }

    public async Task UpdateUnitAsync(Guid id, CreateOrUpdateUnit prop)
    {
        ArgumentNullException.ThrowIfNull(prop);

        var unit = await unitRepository.GetAsync(id);
        var targetBlockId = prop.BlockId != Guid.Empty ? prop.BlockId : unit.BlockId;
        var block = await blockRepository.FindAsync(targetBlockId);

        unit.SetUnitNumber(string.IsNullOrWhiteSpace(prop.UnitNumber) ? prop.CircleName : prop.UnitNumber);
        unit.BlockId = targetBlockId;
        unit.HomeOwnerId = prop.HomeOwnerId;
        unit.HirerId = prop.HirerId;
        unit.UnitType = string.IsNullOrWhiteSpace(prop.UnitType) ? "Daire" : prop.UnitType;
        unit.SetFloor(prop.Floor, block?.TotalFloors);
        unit.GrossSquareMeters = prop.GrossSquareMeters;
        unit.NetSquareMeters = prop.NetSquareMeters;
        await unitRepository.UpdateAsync(unit, autoSave: true);
    }

    public async Task UpdateBulkUnitsAsync(UpdateBulkUnitsDto prop)
    {
        ArgumentNullException.ThrowIfNull(prop);

        if (prop.Units is null || prop.Units.Count == 0)
        {
            return;
        }

        var unitIds = prop.Units.Select(u => u.Id).ToList();
        var units = await unitRepository.GetListAsync(u => unitIds.Contains(u.Id));

        var blockIds = prop.Units.Select(u => u.BlockId).Where(id => id != Guid.Empty).Distinct().ToList();
        var blocks = await blockRepository.GetListAsync(b => blockIds.Contains(b.Id));
        var blockMap = blocks.ToDictionary(b => b.Id);

        foreach (var item in prop.Units)
        {
            var unit = units.FirstOrDefault(u => u.Id == item.Id);
            if (unit is null) continue;

            var targetBlockId = item.BlockId != Guid.Empty ? item.BlockId : unit.BlockId;
            blockMap.TryGetValue(targetBlockId, out var block);

            if (!string.IsNullOrWhiteSpace(item.UnitNumber))
            {
                unit.SetUnitNumber(item.UnitNumber);
            }

            unit.BlockId = targetBlockId;
            unit.HomeOwnerId = item.HomeOwnerId;
            unit.HirerId = item.HirerId;
            unit.UnitType = string.IsNullOrWhiteSpace(item.UnitType) ? "Daire" : item.UnitType;
            unit.SetFloor(item.Floor, block?.TotalFloors);
            unit.GrossSquareMeters = item.GrossSquareMeters;
            unit.NetSquareMeters = item.NetSquareMeters;
        }

        await unitRepository.UpdateManyAsync(units, autoSave: true);
    }

    public async Task DeleteUnitAsync(Guid id)
    {
        var unit = await unitRepository.GetAsync(id);
        await unitRepository.DeleteAsync(unit, autoSave: true);
    }

    public async Task DeleteBulkUnitsAsync(DeleteBulkUnitsDto prop)
    {
        ArgumentNullException.ThrowIfNull(prop);

        if (prop.UnitIds is null || prop.UnitIds.Count == 0)
        {
            return;
        }

        var units = await unitRepository.GetListAsync(u => prop.UnitIds.Contains(u.Id));
        await unitRepository.DeleteManyAsync(units, autoSave: true);
    }

    public async Task<List<UnitDto>> GetUnitListAsync()
    {
        var unitQuery = await unitRepository.GetQueryableAsync();
        var blockQuery = await blockRepository.GetQueryableAsync();
        var housing = await GetSelectedHousingAsync();

        if (housing == null)
        {
            return [];
        }

        var query = from u in unitQuery
                    join b in blockQuery on u.BlockId equals b.Id
                    where b.HousingId == housing.Id
                    select new { Unit = u, b.BlockName };

        var list = query.ToList();
        return [.. list.Select(x =>
        {
            var dto = ObjectMapper.Map<Unit, UnitDto>(x.Unit);
            dto.BlockName = x.BlockName;
            return dto;
        })];
    }

    public async Task<List<UnitDto>> GetUnitListByBlockIdAsync(Guid blockId)
    {
        var units = await GetUnitListAsync();
        return [.. units.Where(x => x.BlockId == blockId)];
    }
}
