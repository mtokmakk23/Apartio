using Apartio.Housings;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;

namespace Apartio.Expenses;

[Authorize]
public class ExpenseService(IExpenseRepository expenseRepository, IHousingAppService housingAppService) : ApartioAppService, IExpenseAppService
{
	public async Task CreateAsync(CreateOrUpdateExpense prop)
	{
		if (prop.Amount <= 0)
		{
			throw new UserFriendlyException("Tutar 0'dan büyük olmalıdır.");
		}

		if (prop.PaidAmount < 0)
		{
			throw new UserFriendlyException("Ödenen tutar negatif olamaz.");
		}

		if (prop.PaidAmount > prop.Amount)
		{
			throw new UserFriendlyException("Ödenen tutar toplam tutardan büyük olamaz.");
		}

		var housingId = prop.HousingId ?? (await housingAppService.GetSelectedHousingAsync())?.Id;
		if (!housingId.HasValue || housingId.Value == Guid.Empty)
		{
			throw new UserFriendlyException("Seçili konut bulunamadı.");
		}

		var expense = ObjectMapper.Map<CreateOrUpdateExpense, Expense>(prop);
		expense.HousingId = housingId.Value;

		ApplyPaymentStatusRules(expense);

		await expenseRepository.InsertAsync(expense, autoSave: true);
	}

	public async Task<ExpenseDto> GetAsync(Guid id)
	{
		var expense = await expenseRepository.GetAsync(id);
		if (expense == null)
		{
			throw new UserFriendlyException("Gider kaydı bulunamadı.");
		}

		return ObjectMapper.Map<Expense, ExpenseDto>(expense);
	}

	public async Task<List<ExpenseDto>> GetListAsync()
	{
		var housing = await housingAppService.GetSelectedHousingAsync();
		if (housing == null)
		{
			return new List<ExpenseDto>();
		}

		var expenses = await expenseRepository.GetListByHousingIdAsync(housing.Id);
		return expenses.Select(ObjectMapper.Map<Expense, ExpenseDto>).ToList();
	}

	public async Task UpdateAsync(Guid id, CreateOrUpdateExpense prop)
	{
		if (prop.Amount <= 0)
		{
			throw new UserFriendlyException("Tutar 0'dan büyük olmalıdır.");
		}

		if (prop.PaidAmount < 0)
		{
			throw new UserFriendlyException("Ödenen tutar negatif olamaz.");
		}

		if (prop.PaidAmount > prop.Amount)
		{
			throw new UserFriendlyException("Ödenen tutar toplam tutardan büyük olamaz.");
		}

		var housingId = prop.HousingId ?? (await housingAppService.GetSelectedHousingAsync())?.Id;
		if (!housingId.HasValue || housingId.Value == Guid.Empty)
		{
			throw new UserFriendlyException("Seçili konut bulunamadı.");
		}

		var expense = await expenseRepository.GetAsync(id);
		if (expense == null)
		{
			throw new UserFriendlyException("Gider kaydı bulunamadı.");
		}

		ObjectMapper.Map(prop, expense);
		expense.HousingId = housingId.Value;

		ApplyPaymentStatusRules(expense);

		await expenseRepository.UpdateAsync(expense, autoSave: true);
	}

	public async Task DeleteAsync(Guid id)
	{
		var expense = await expenseRepository.GetAsync(id);
		if (expense == null)
		{
			throw new UserFriendlyException("Silinmek istenen gider kaydı bulunamadı.");
		}

		await expenseRepository.DeleteAsync(id);
	}

	/// <summary>
	/// Gider ödeme durumunu tutarlara göre otomatik belirleyen iş kuralı
	/// </summary>
	private static void ApplyPaymentStatusRules(Expense expense)
	{
		if (expense.Status == ExpenseStatus.Cancelled)
		{
			return;
		}

		if (expense.PaidAmount >= expense.Amount && expense.Amount > 0)
		{
			expense.Status = ExpenseStatus.Paid;
			expense.PaymentDate ??= DateTime.Now;
		}
		else if (expense.PaidAmount > 0)
		{
			expense.Status = ExpenseStatus.PartiallyPaid;
		}
		else
		{
			expense.Status = ExpenseStatus.Pending;
		}
	}
}
