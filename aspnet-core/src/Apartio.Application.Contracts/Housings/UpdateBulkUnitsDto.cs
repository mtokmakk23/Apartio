using System;
using System.Collections.Generic;
using Volo.Abp.ObjectExtending;

namespace Apartio.Housings;

public class UpdateBulkUnitItemDto
{
    public Guid Id { get; set; }
    public Guid BlockId { get; set; }
    public string UnitNumber { get; set; } = string.Empty;
    public string UnitType { get; set; } = "Daire";
    public int Floor { get; set; } = 1;
    public decimal? GrossSquareMeters { get; set; }
    public decimal? NetSquareMeters { get; set; }
    public Guid? HomeOwnerId { get; set; }
    public Guid? HirerId { get; set; }
}

public class UpdateBulkUnitsDto : ExtensibleObject
{
    public List<UpdateBulkUnitItemDto> Units { get; set; } = [];
}
