using Volo.Abp.Domain.Entities;

namespace Apartio.Housings;

public class HousingType : Entity<int>
{
	public string Name { get; set; }
	public string? Description { get; set; }

	protected HousingType()
	{
	}

	public HousingType(int id, string name, string? description = null)
	{
		Id = id;
		Name = name;
		Description = description;
	}
}
