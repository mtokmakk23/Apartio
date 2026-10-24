using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Housings;

public class Block : AuditedAggregateRoot<Guid>, ISoftDelete
{
    public bool IsDeleted { get; set; }
    public Guid HousingId { get; set; }
    public string BlockName { get; set; } = string.Empty;
    public byte ElevatorCount { get; set; }
    public byte TotalFloors { get; set; }

    protected Block()
    {
    }

    public Block(Guid housingId, string blockName, byte elevatorCount = 0, byte totalFloors = 1)
    {
        HousingId = housingId;
        SetBlockName(blockName);
        SetElevatorCount(elevatorCount);
        SetTotalFloors(totalFloors);
    }

    public void SetBlockName(string blockName)
    {
        if (string.IsNullOrWhiteSpace(blockName))
        {
            throw new UserFriendlyException("Blok adı boş olamaz!");
        }
        BlockName = blockName.Trim();
    }

    public void SetElevatorCount(byte elevatorCount)
    {
        if (elevatorCount > 15)
        {
            throw new UserFriendlyException("Bir blokta asansör sayısı en fazla 15 olabilir!");
        }
        ElevatorCount = elevatorCount;
    }

    public void SetTotalFloors(byte totalFloors)
        => TotalFloors = totalFloors == 0 ? (byte)1 : totalFloors;
}

