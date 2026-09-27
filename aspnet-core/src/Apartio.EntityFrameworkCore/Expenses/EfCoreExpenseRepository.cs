using Apartio.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.Expenses;

public class EfCoreExpenseRepository : EfCoreRepository<ApartioDbContext, Expense, Guid>, IExpenseRepository
{
	public EfCoreExpenseRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
	{
	}

	public async Task<List<Expense>> GetListByHousingIdAsync(Guid housingId, CancellationToken cancellationToken = default)
	{
		var dbSet = await GetDbSetAsync();
		return await dbSet
			.Where(x => x.HousingId == housingId)
			.OrderByDescending(x => x.ExpenseDate)
			.ToListAsync(GetCancellationToken(cancellationToken));
	}
}
