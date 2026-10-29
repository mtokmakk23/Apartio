using System;
using System.Collections.Generic;
using Volo.Abp.ObjectExtending;

namespace Apartio.Housings;

public class DeleteBulkUnitsDto : ExtensibleObject
{
    public List<Guid> UnitIds { get; set; } = [];
}
