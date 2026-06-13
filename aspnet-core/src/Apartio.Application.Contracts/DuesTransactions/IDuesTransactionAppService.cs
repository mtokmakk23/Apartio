using Apartio.DuesTransactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apartio.DuesTransactions
{
    public interface IDuesTransactionAppService : IApplicationService
    {
        Task<List<DuesTransactionDto>> GetDuesTransactionListAsync();
        Task CreateDuesTransactionAsync(CreateOrUpdateDuesTransaction prop);
        Task UpdateDuesTransactionAsync(Guid id, CreateOrUpdateDuesTransaction prop);
        Task DeleteDuesTransactionAsync(Guid id);
        Task<DuesTransactionDto> GetDuesTransactionAsync(Guid id);
    }
}
