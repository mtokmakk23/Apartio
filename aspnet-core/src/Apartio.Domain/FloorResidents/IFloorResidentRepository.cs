using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apartio.FloorResidents
{
    public interface IFloorResidentRepository : IRepository<FloorResident, Guid>
    {
    }
}
