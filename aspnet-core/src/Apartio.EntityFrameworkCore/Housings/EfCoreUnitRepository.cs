using Apartio.EntityFrameworkCore;
using System;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.Housings
{
    public class EfCoreUnitRepository : EfCoreRepository<ApartioDbContext, Unit, Guid>, IUnitRepository
    {
        public EfCoreUnitRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
        {
        }
    }
}
