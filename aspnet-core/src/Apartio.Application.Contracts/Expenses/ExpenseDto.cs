using System;
using Volo.Abp.Application.Dtos;

namespace Apartio.Expenses;

public sealed class ExpenseDto : EntityDto<Guid>
{
	public Guid HousingId { get; set; }
	public string Title { get; set; } = string.Empty;
	public string Category { get; set; } = string.Empty;
	public decimal Amount { get; set; }
	public decimal PaidAmount { get; set; }
	public DateTime ExpenseDate { get; set; }
	public DateTime? DueDate { get; set; }
	public DateTime? PaymentDate { get; set; }
	public string? Supplier { get; set; }
	public string? CurrentAccount { get; set; }
	public string? CashDesk { get; set; }
	public string? DocumentNo { get; set; }
	public string? Description { get; set; }
	public ExpenseStatus Status { get; set; } = ExpenseStatus.Pending;
	public bool IsRecurring { get; set; }
	public string? RecurringPeriod { get; set; }
	public string? InvoiceFile { get; set; }
	public string? InvoiceFileName { get; set; }
}
