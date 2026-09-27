using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apartio.Expenses;

public interface IExpenseRepository : IRepository<Expense, Guid>
{
	Task<List<Expense>> GetListByHousingIdAsync(Guid housingId, CancellationToken cancellationToken = default);
}
