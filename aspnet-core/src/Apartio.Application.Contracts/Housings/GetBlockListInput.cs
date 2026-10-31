using System;
using System.Collections.Generic;

namespace Apartio.Housings;

public class GetBlockListInput
{
    public Guid? HousingId { get; set; }
    public List<Guid>? HousingIds { get; set; }
    public string? HousingIdList { get; set; }
}

