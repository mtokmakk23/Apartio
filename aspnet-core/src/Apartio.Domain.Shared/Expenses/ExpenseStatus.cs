namespace Apartio.Expenses;

public enum ExpenseStatus : byte
{
	None = 0,
	Pending = 1,
	PartiallyPaid = 2,
	Paid = 3,
	Cancelled = 4
}
