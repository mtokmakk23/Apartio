using Apartio.EntityFrameworkCore;
using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.FloorResidents
{
    public class EfCoreFloorResidentRepository : EfCoreRepository<ApartioDbContext, FloorResident, Guid>, IFloorResidentRepository
    {
        IDbContextProvider<ApartioDbContext> _dbContextProvider;

        public EfCoreFloorResidentRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;

        }
    }
}
