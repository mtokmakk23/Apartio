using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Assets;

public class Asset : AuditedAggregateRoot<Guid>, ISoftDelete
{
    public bool IsDeleted { get; set; }
    public Guid HousingId { get; set; }
    public Guid LocationId { get; set; }
    public string? LocationType { get; set; }
    public string? LocationDetail { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime? PurchaseDate { get; set; }
    public string? Supplier { get; set; }
    public DateTime? WarrantyEndDate { get; set; }
    public string Status { get; set; } = "Aktif";
    public string? Notes { get; set; }

    public Asset()
    {
    }

    public Asset(
        Guid id,
        Guid housingId,
        Guid locationId,
        string name,
        string code,
        string category,
        string location,
        string? locationType = null,
        string? locationDetail = null,
        DateTime? purchaseDate = null,
        string? supplier = null,
        DateTime? warrantyEndDate = null,
        string status = "Aktif",
        string? notes = null) : base(id)
    {
        HousingId = housingId;
        LocationId = locationId;
        LocationType = locationType;
        LocationDetail = locationDetail;
        Name = name;
        Code = code;
        Category = category;
        Location = location;
        PurchaseDate = purchaseDate;
        Supplier = supplier;
        WarrantyEndDate = warrantyEndDate;
        Status = status;
        Notes = notes;
    }
}
