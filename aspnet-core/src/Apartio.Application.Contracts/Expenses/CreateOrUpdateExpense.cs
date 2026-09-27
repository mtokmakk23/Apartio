using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.ObjectExtending;

namespace Apartio.Expenses;

public sealed class CreateOrUpdateExpense : ExtensibleObject
{
	public Guid? HousingId { get; set; }

	[Required(ErrorMessage = "Başlık zorunludur.")]
	[StringLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
	public string Title { get; set; } = string.Empty;

	[Required(ErrorMessage = "Kategori zorunludur.")]
	[StringLength(100, ErrorMessage = "Kategori en fazla 100 karakter olabilir.")]
	public string Category { get; set; } = string.Empty;

	[Range(0.01, double.MaxValue, ErrorMessage = "Tutar 0'dan büyük olmalıdır.")]
	public decimal Amount { get; set; }

	[Range(0, double.MaxValue, ErrorMessage = "Ödenen tutar 0 veya pozitif olmalıdır.")]
	public decimal PaidAmount { get; set; }

	[Required(ErrorMessage = "Harcama tarihi zorunludur.")]
	public DateTime ExpenseDate { get; set; }

	public DateTime? DueDate { get; set; }

	public DateTime? PaymentDate { get; set; }

	[StringLength(150, ErrorMessage = "Tedarikçi adı en fazla 150 karakter olabilir.")]
	public string? Supplier { get; set; }

	[StringLength(150, ErrorMessage = "Cari hesap bilgisi en fazla 150 karakter olabilir.")]
	public string? CurrentAccount { get; set; }

	[StringLength(100, ErrorMessage = "Kasa/Banka bilgisi en fazla 100 karakter olabilir.")]
	public string? CashDesk { get; set; }

	[StringLength(100, ErrorMessage = "Evrak no en fazla 100 karakter olabilir.")]
	public string? DocumentNo { get; set; }

	[StringLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir.")]
	public string? Description { get; set; }

	public ExpenseStatus Status { get; set; } = ExpenseStatus.Pending;

	public bool IsRecurring { get; set; }

	[StringLength(50)]
	public string? RecurringPeriod { get; set; }

	public string? InvoiceFile { get; set; }

	[StringLength(255)]
	public string? InvoiceFileName { get; set; }
}
