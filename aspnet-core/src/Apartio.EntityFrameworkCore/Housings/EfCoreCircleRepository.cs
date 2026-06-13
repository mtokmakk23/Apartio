using Apartio.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.Housings
{
    public class EfCoreCircleRepository : EfCoreRepository<ApartioDbContext, Circle, Guid>, ICircleRepository
    {
        IDbContextProvider<ApartioDbContext> _dbContextProvider;

        public EfCoreCircleRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;

        }
    }
}
