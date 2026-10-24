using System;
using Volo.Abp.Application.Dtos;

namespace Apartio.Housings;

public class BlockDto : EntityDto<Guid>
{
    public Guid HousingId { get; set; }
    public string BlockName { get; set; } = string.Empty;
    public byte ElevatorCount { get; set; }
    public byte TotalFloors { get; set; }
}

