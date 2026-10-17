using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Assets;

public class AssetMaintenanceLog : AuditedEntity<Guid>
{
    public Guid AssetId { get; set; }
    public DateTime MaintenanceDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public string? PerformedBy { get; set; }

    public AssetMaintenanceLog()
    {
    }

    public AssetMaintenanceLog(
        Guid id,
        Guid assetId,
        DateTime maintenanceDate,
        string description,
        decimal cost,
        string? performedBy = null) : base(id)
    {
        AssetId = assetId;
        MaintenanceDate = maintenanceDate;
        Description = description;
        Cost = cost;
        PerformedBy = performedBy;
    }
}
