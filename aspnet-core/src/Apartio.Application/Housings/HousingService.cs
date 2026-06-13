using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;

namespace Apartio.Housings
{
    [Authorize]
    public class HousingService : ApartioAppService, IHousingAppService
    {
        private readonly IHousingRepository _housingRepository;
        private readonly IUserMatchHousingRepository _userMatchHousingRepository;
        private readonly IMemoryCache _cache;
        private readonly IBlockRepository _blockRepository;
        private readonly ICircleRepository _circleRepository;
        public HousingService(IHousingRepository housingRepository, IUserMatchHousingRepository userMatchHousingRepository, IMemoryCache cache, IBlockRepository blockRepository, ICircleRepository circleRepository)
        {
            _housingRepository = housingRepository;
            _userMatchHousingRepository = userMatchHousingRepository;
            _cache = cache;
            _blockRepository = blockRepository;
            _circleRepository = circleRepository;
        }

        public async Task CreateHousingAsync(CreateOrUpdateHousing prop)
        {
            var property = new Housing(prop.Name, prop.City, prop.Town, prop.Type, prop.Adress, prop.PostalCode, prop.Email, prop.Phone, prop.IsDelayCompensation, prop.DelayCompensationRate, prop.LastPaymentDay);
            await _housingRepository.InsertAsync(property, autoSave: true);
        }

        public async Task DeleteAsync(Guid id)
        {

            var property = await _housingRepository.GetAsync(id);
            await _housingRepository.DeleteAsync(property, autoSave: true);
        }

        public async Task<HousingDto> GetAsync(Guid id)
        {
            return ObjectMapper.Map<Housing, HousingDto>(await _housingRepository.GetAsync(id));
        }

        public async Task<List<HousingDto>> GetListAsync()
        {
            return ObjectMapper.Map<List<Housing>, List<HousingDto>>(await _housingRepository.GetListAsync());
        }

        public async Task UpdateHousingAsync(Guid id, CreateOrUpdateHousing prop)
        {
            var property = await _housingRepository.GetAsync(id);
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

            await _housingRepository.UpdateAsync(property, autoSave: true);
        }

        public async Task ChangeHousingAsync(Guid housingId)
        {
            var housing = await _housingRepository.GetListAsync(x => x.Id == housingId);
            if (housing.Count > 0)
            {
                var userMatchHousing = await _userMatchHousingRepository.GetListAsync(x => x.UserId == CurrentUser.Id);
                if (userMatchHousing.Count > 0)
                {
                    var prop = userMatchHousing[0];
                    prop.HousingId = housingId;
                    await _userMatchHousingRepository.UpdateAsync(prop, autoSave: true);
                }
                else
                {
                    var newUserMatchHousing = new UserMatchHousing((Guid)CurrentUser.Id, housingId);
                    await _userMatchHousingRepository.InsertAsync(newUserMatchHousing, autoSave: true);
                }

            }
            else throw new UserFriendlyException("Konut Bulunamadı!");
        }

        public async Task<HousingDto> GetSelectedHousingAsync()
        {
            var cacheKey = $"user:{CurrentUser.Id}";


            // 1. CACHE CHECK
            if (_cache.TryGetValue(cacheKey, out HousingDto prop))
            {
                return prop;
            }

            HousingDto _prop;
            // 2. DB FETCH
            var userMatchHousing = await _userMatchHousingRepository.GetListAsync(x => x.UserId == CurrentUser.Id);
            if (userMatchHousing.Count > 0)
            {

                _prop = await GetAsync(userMatchHousing[0].HousingId);
            }
            else
            {
                _prop = (await GetListAsync()).FirstOrDefault();
            }

            if (_prop == null)
                return null;

            // 3. CACHE WRITE
            _cache.Set(cacheKey, _prop, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(2)
            });

            return _prop;
        }

        public async Task<List<BlockDto>> GetBlockListAsync()
        {
            var housing = await GetSelectedHousingAsync();
            return ObjectMapper.Map<List<Block>, List<BlockDto>>(await _blockRepository.GetListAsync(x => x.HousingId == housing.Id));
        }

        public async Task DeleteBlock(Guid id)
        {
            var block = await _blockRepository.GetAsync(id);
            await _blockRepository.DeleteAsync(block, autoSave: true);
        }
        public async Task CreateBlockAsync(CreateOrUpdateBlock prop)
        {
            var housing = await GetSelectedHousingAsync();
            var block = new Block(housing.Id, prop.BlockName);
            await _blockRepository.InsertAsync(block, autoSave: true);
        }

        public async Task UpdateBlockAsync(Guid id, CreateOrUpdateBlock prop)
        {
            var block = await _blockRepository.GetAsync(id);
            block.SetBlockName(prop.BlockName);
            await _blockRepository.UpdateAsync(block, autoSave: true);
        }

        public async Task UpdateCircleAsync(Guid id, CreateOrUpdateCircle prop)
        {
            var circle = await _circleRepository.GetAsync(id);
            circle.SetCircleName(prop.CircleName);
            circle.BlockId = prop.BlockId;
            circle.HomeOwnerId = prop.HomeOwnerId;
            circle.HirerId = prop.HirerId;
            await _circleRepository.UpdateAsync(circle, autoSave: true);
        }

        public async Task CreateCircleAsync(CreateOrUpdateCircle prop)
        {
            var circle = new Circle(prop.BlockId, prop.CircleName, prop.HomeOwnerId, prop.HirerId);
            await _circleRepository.InsertAsync(circle, autoSave: true);
        }

        public async Task DeleteCircle(Guid id)
        {
            var circle = await _circleRepository.GetAsync(id);
            await _circleRepository.DeleteAsync(circle, autoSave: true);
        }
        

        public async Task<List<CircleDto>> GetCircleListAsync(Guid blockId)
        {
            var circleQuery=await _circleRepository.GetQueryableAsync();
            var blockQuery = await _blockRepository.GetQueryableAsync();
            var housing = await GetSelectedHousingAsync();

            var circles = from c in circleQuery
                          join b in blockQuery on c.BlockId equals b.Id
                          where b.HousingId == housing.Id && c.BlockId == blockId
                          select c;
            return ObjectMapper.Map<List<Circle>, List<CircleDto>>(circles.ToList());
        }
    }
}
