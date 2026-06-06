using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.Housings
{
    public class HousingService : ApartioAppService, IHousingAppService
    {
        private readonly IHousingRepository _housingRepository;

        public HousingService(IHousingRepository housingRepository)
        {
            _housingRepository = housingRepository;
        }

        public async Task CreateHousing(CreateOrUpdateHousing prop)
        {
           var property = new Housing(prop.Name, prop.City, prop.Town, prop.Type, prop.Adress, prop.PostalCode, prop.Email, prop.Phone);
            await _housingRepository.InsertAsync(property,autoSave:true);
        }

        public async Task Delete(Guid id)
        {
            var property = await _housingRepository.GetAsync(id);
            await _housingRepository.DeleteAsync(property, autoSave: true);
        }

        public async Task<HousingDto> Get(Guid id)
        {
            return ObjectMapper.Map<Housing, HousingDto>(await _housingRepository.GetAsync(id));
        }

        public async Task<List<HousingDto>> GetListAsync()
        {
            return ObjectMapper.Map<List<Housing>, List<HousingDto>>(await _housingRepository.GetListAsync());
        }

        public async Task UpdateHousing(Guid id,CreateOrUpdateHousing prop)
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
            await _housingRepository.UpdateAsync(property, autoSave: true);
        }
    }
}
