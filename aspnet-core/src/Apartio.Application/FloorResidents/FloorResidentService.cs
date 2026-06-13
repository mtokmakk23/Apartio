using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.FloorResidents
{
    public class FloorResidentService : ApartioAppService, IFloorResidentAppService
    {
        private readonly IFloorResidentRepository _floorResidentRepository;
        private readonly IHousingAppService _housingAppService;

        public FloorResidentService(IFloorResidentRepository floorResidentRepository)
        {
            _floorResidentRepository = floorResidentRepository;
        }

        public async Task CreateFloorResidentAsync(CreateOrUpdateFloorResident prop)
        {
            var housing = await _housingAppService.GetSelectedHousingAsync();
            var property = new FloorResident(housing.Id, prop.Name, prop.Surname, prop.Phone, prop.Email, prop.IsActive, prop.Identity);
            await _floorResidentRepository.InsertAsync(property, autoSave: true);
        }

        public async Task DeleteFloorResidentAsync(Guid id)
        {
            await _floorResidentRepository.DeleteAsync(id, autoSave: true);
        }

        public async Task<FloorResidentDto> GetFloorResidentAsync(Guid id)
        {
            var floorResident = await _floorResidentRepository.GetAsync(id);
            return ObjectMapper.Map<FloorResident, FloorResidentDto>(floorResident);
        }

        public async Task<List<FloorResidentDto>> GetFloorResidentListAsync()
        {
            var housing = await _housingAppService.GetSelectedHousingAsync();
            var floorResidents = await _floorResidentRepository.GetListAsync(x=>x.HousingId == housing.Id);
            return floorResidents.Select(ObjectMapper.Map<FloorResident, FloorResidentDto>).ToList();
        }

        public async Task UpdateFloorResidentAsync(Guid id, CreateOrUpdateFloorResident prop)
        {
            var property = await _floorResidentRepository.GetAsync(id);
            property.SetName(prop.Name);
            property.SetSurname(prop.Surname);
            property.SetIdentity(prop.Identity);
            property.Phone = prop.Phone;
            property.Email = prop.Email;
            property.IsActive = prop.IsActive;
            await _floorResidentRepository.UpdateAsync(property, autoSave: true);
        }
    }
}
