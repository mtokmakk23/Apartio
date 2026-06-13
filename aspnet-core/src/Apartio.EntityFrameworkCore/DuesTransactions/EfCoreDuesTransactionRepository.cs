using Apartio.EntityFrameworkCore;
using Apartio.FloorResidents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.DuesTransactions
{
    public class EfCoreDuesTransactionRepository : EfCoreRepository<ApartioDbContext, DuesTransaction, Guid>, IDuesTransactionRepository
    {
        IDbContextProvider<ApartioDbContext> _dbContextProvider;

        public EfCoreDuesTransactionRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;

        }
    }
}
