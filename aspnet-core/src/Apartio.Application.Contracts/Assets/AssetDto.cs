using System;
using Volo.Abp.Application.Dtos;

namespace Apartio.Assets;

public class AssetDto : AuditedEntityDto<Guid>
{
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
}
