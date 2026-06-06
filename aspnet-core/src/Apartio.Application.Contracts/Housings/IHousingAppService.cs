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
        Task CreateHousing(CreateOrUpdateHousing prop);
        Task UpdateHousing(Guid id,CreateOrUpdateHousing prop);
        Task Delete(Guid id);
        Task<HousingDto> Get(Guid id);
    }
}
