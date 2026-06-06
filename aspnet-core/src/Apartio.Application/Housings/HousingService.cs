using IdentityServer4.Services;
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
    public class HousingService : ApartioAppService, IHousingAppService
    {
        private readonly IHousingRepository _housingRepository;
        private readonly IUserMatchHousingRepository _userMatchHousingRepository;
        private readonly IMemoryCache _cache;

        public HousingService(IHousingRepository housingRepository, IUserMatchHousingRepository userMatchHousingRepository, IMemoryCache cache)
        {
            _housingRepository = housingRepository;
            _userMatchHousingRepository = userMatchHousingRepository;
            _cache = cache;
        }

        public async Task CreateHousingAsync(CreateOrUpdateHousing prop)
        {
           var property = new Housing(prop.Name, prop.City, prop.Town, prop.Type, prop.Adress, prop.PostalCode, prop.Email, prop.Phone, prop.IsDelayCompensation, prop.DelayCompensationRate);
            await _housingRepository.InsertAsync(property,autoSave:true);
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

        public async Task UpdateHousingAsync(Guid id,CreateOrUpdateHousing prop)
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
            await _housingRepository.UpdateAsync(property, autoSave: true);
        }

        public async Task ChangeHousingAsync(Guid housingId)
        {
            var housing = await _housingRepository.GetListAsync(x=>x.Id == housingId);
            if (housing.Count>0)
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

            } else throw new UserFriendlyException("Konut Bulunamadı!");
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

                _prop=await GetAsync(userMatchHousing[0].HousingId);
            }
            else
            {
                _prop=(await GetListAsync()).FirstOrDefault();
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
    }
}
