using Volo.Abp.ObjectExtending;

namespace Apartio.Housings;

public class CreateOrUpdateHousing : ExtensibleObject
{
	public string Name { get; init; }
	public string City { get; init; }
	public string Town { get; init; }
	public string? Adress { get; init; }
	public string? PostalCode { get; init; }
	public string? Email { get; init; }
	public string? Phone { get; init; }
	public int Type { get; init; }
	public bool IsDelayCompensation { get; set; }
	public decimal DelayCompensationRate { get; set; }
	public int LastPaymentDay { get; set; }
}
