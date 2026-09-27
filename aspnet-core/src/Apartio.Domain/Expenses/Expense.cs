using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Expenses;

public class Expense : AuditedAggregateRoot<Guid>, ISoftDelete
{
	public bool IsDeleted { get; set; }
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

	public Expense()
	{
	}

	public Expense(
		Guid housingId,
		string title,
		string category,
		decimal amount,
		decimal paidAmount,
		DateTime expenseDate,
		DateTime? dueDate = null,
		DateTime? paymentDate = null,
		string? supplier = null,
		string? currentAccount = null,
		string? cashDesk = null,
		string? documentNo = null,
		string? description = null,
		ExpenseStatus status = ExpenseStatus.Pending,
		bool isRecurring = false,
		string? recurringPeriod = null,
		string? invoiceFile = null,
		string? invoiceFileName = null)
	{
		HousingId = housingId;
		Title = title;
		Category = category;
		Amount = amount;
		PaidAmount = paidAmount;
		ExpenseDate = expenseDate;
		DueDate = dueDate;
		PaymentDate = paymentDate;
		Supplier = supplier;
		CurrentAccount = currentAccount;
		CashDesk = cashDesk;
		DocumentNo = documentNo;
		Description = description;
		Status = status;
		IsRecurring = isRecurring;
		RecurringPeriod = recurringPeriod;
		InvoiceFile = invoiceFile;
		InvoiceFileName = invoiceFileName;
	}

	public Expense Clone()
	{
		return (Expense)this.MemberwiseClone();
	}
}
