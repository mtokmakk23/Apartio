using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apartio.Expenses;

public interface IExpenseAppService : IApplicationService
{
	Task<List<ExpenseDto>> GetListAsync();
	Task<ExpenseDto> GetAsync(Guid id);
	Task CreateAsync(CreateOrUpdateExpense prop);
	Task UpdateAsync(Guid id, CreateOrUpdateExpense prop);
	Task DeleteAsync(Guid id);
}
