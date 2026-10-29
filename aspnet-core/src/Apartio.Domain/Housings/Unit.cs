using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Housings;

public class Unit : AuditedAggregateRoot<Guid>, ISoftDelete
{
    public bool IsDeleted { get; set; }
    public Guid BlockId { get; set; }
    public string UnitNumber { get; set; } = string.Empty;
    public string UnitType { get; set; } = "Daire";
    public int Floor { get; set; } = 1;
    public decimal? GrossSquareMeters { get; set; }
    public decimal? NetSquareMeters { get; set; }
    public Guid? HomeOwnerId { get; set; }
    public Guid? HirerId { get; set; }

    // Geriye dönük uyumluluk için alias
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string CircleName
    {
        get => UnitNumber;
        set => UnitNumber = value;
    }

    protected Unit()
    {
    }

    public Unit(
        Guid blockId,
        string unitNumber,
        int floor,
        Guid? homeOwnerId = null,
        Guid? hirerId = null,
        string unitType = "Daire",
        decimal? grossSquareMeters = null,
        decimal? netSquareMeters = null,
        int? maxFloors = null)
    {
        BlockId = blockId;
        SetUnitNumber(unitNumber);
        HomeOwnerId = homeOwnerId;
        HirerId = hirerId;
        UnitType = string.IsNullOrWhiteSpace(unitType) ? "Daire" : unitType;
        SetFloor(floor, maxFloors);
        GrossSquareMeters = grossSquareMeters;
        NetSquareMeters = netSquareMeters;
    }

    public void SetUnitNumber(string unitNumber)
    {
        if (string.IsNullOrWhiteSpace(unitNumber))
        {
            throw new UserFriendlyException("Bağımsız bölüm (kapı) numarası boş olamaz!");
        }
        UnitNumber = unitNumber.Trim();
    }

    public void SetFloor(int floor, int? maxFloors = null)
    {
        if (floor < -10)
        {
            throw new UserFriendlyException("Kat numarası -10'dan küçük olamaz!");
        }

        if (maxFloors.HasValue && maxFloors.Value > 0 && floor > maxFloors.Value)
        {
            throw new UserFriendlyException($"Bulunduğu kat ({floor}), bloğun maksimum kat sayısından ({maxFloors.Value}) büyük olamaz!");
        }

        Floor = floor;
    }
}
