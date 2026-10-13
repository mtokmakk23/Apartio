using System;
using System.ComponentModel.DataAnnotations;

namespace Apartio.Assets;

public class CreateOrUpdateMaintenanceLogDto
{
    [Required]
    public Guid AssetId { get; set; }

    [Required]
    public DateTime MaintenanceDate { get; set; }

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Maliyet negatif olamaz.")]
    public decimal Cost { get; set; }

    public string? PerformedBy { get; set; }
}
