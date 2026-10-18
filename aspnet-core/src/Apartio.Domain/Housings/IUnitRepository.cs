using System;
using Volo.Abp.Domain.Repositories;

namespace Apartio.Housings
{
    public interface IUnitRepository : IRepository<Unit, Guid>
    {
    }
}
