using Apartio.FloorResidents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apartio.DuesTransactions
{
    public interface IDuesTransactionRepository : IRepository<DuesTransaction, Guid>
    {
    }
}
