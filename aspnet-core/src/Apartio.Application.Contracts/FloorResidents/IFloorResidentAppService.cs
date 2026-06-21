using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apartio.FloorResidents
{
    public interface IFloorResidentAppService : IApplicationService
    {
        Task<List<FloorResidentDto>> GetFloorResidentListAsync();
        Task CreateFloorResidentAsync(CreateOrUpdateFloorResident prop);
        Task UpdateFloorResidentAsync(Guid id, CreateOrUpdateFloorResident prop);
        Task DeleteFloorResidentAsync(Guid id);
        Task<FloorResidentDto> GetFloorResidentAsync(Guid id);
        Task<List<FloorResidentExtract>> GetExtract(Guid FloorResidentId);
    }
}
