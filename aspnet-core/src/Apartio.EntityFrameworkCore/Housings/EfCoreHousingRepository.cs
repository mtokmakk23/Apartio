using Apartio.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.Housings
{
    public class EfCoreHousingRepository : EfCoreRepository<ApartioDbContext, Housing, Guid>, IHousingRepository
    {
        IDbContextProvider<ApartioDbContext> _dbContextProvider;

        public EfCoreHousingRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;

        }
    }
}
