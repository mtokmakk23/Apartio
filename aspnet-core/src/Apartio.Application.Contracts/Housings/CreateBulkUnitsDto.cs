using System;
using System.Collections.Generic;
using Volo.Abp.ObjectExtending;

namespace Apartio.Housings;

public class CreateBulkUnitsDto : ExtensibleObject
{
    public Guid BlockId { get; set; }
    public List<CreateOrUpdateUnit> Units { get; set; } = [];
}
