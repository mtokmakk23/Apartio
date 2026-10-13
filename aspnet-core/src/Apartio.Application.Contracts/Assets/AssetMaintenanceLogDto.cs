using System;
using Volo.Abp.Application.Dtos;

namespace Apartio.Assets;

public class AssetMaintenanceLogDto : AuditedEntityDto<Guid>
{
    public Guid AssetId { get; set; }
    public DateTime MaintenanceDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public string? PerformedBy { get; set; }
}
