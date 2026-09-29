using System;
using Volo.Abp.Application.Dtos;

namespace Apartio.Housings;

public class HousingDto : EntityDto<Guid>
{
	public string Name { get; init; }
	public string City { get; init; }
	public string Town { get; init; }
	public string? Adress { get; init; }
	public string? PostalCode { get; init; }
	public string? Email { get; init; }
	public string? Phone { get; init; }
	public int Type { get; init; }
	public string? TypeName { get; set; }
	public bool IsDelayCompensation { get; protected set; }
	public decimal DelayCompensationRate { get; protected set; }
	public int LastPaymentDay { get; set; }
}
