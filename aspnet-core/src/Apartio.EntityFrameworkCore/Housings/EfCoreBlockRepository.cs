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
    public class EfCoreBlockRepository : EfCoreRepository<ApartioDbContext, Block, Guid>, IBlockRepository
    {
        IDbContextProvider<ApartioDbContext> _dbContextProvider;

        public EfCoreBlockRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;

        }
    }
}
