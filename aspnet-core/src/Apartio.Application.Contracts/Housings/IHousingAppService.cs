using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apartio.Housings
{
    public interface IHousingAppService : IApplicationService
    {
        Task<List<HousingDto>> GetListAsync();
        Task CreateHousingAsync(CreateOrUpdateHousing prop);
        Task UpdateHousingAsync(Guid id,CreateOrUpdateHousing prop);
        Task DeleteAsync(Guid id);
        Task<HousingDto> GetAsync(Guid id);
        Task ChangeHousingAsync(Guid housingId);
        Task<HousingDto> GetSelectedHousingAsync();
    }
}
