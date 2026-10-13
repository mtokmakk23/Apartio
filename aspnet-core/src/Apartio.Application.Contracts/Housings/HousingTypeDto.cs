using Volo.Abp.Application.Dtos;

namespace Apartio.Housings;

public class HousingTypeDto : EntityDto<int>
{
	public string Name { get; set; }
	public string? Description { get; set; }
}
