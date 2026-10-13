using System;
using System.ComponentModel.DataAnnotations;

namespace Apartio.Assets;

public class CreateOrUpdateAssetDto
{
    public Guid? HousingId { get; set; }

    [Required(ErrorMessage = "Konum / Blok seçimi zorunludur.")]
    public Guid LocationId { get; set; }

    public string? LocationType { get; set; }
    public string? LocationDetail { get; set; }

    [Required(ErrorMessage = "Demirbaş adı zorunludur.")]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Demirbaş kodu / barkodu zorunludur.")]
    [StringLength(100)]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kategori seçimi zorunludur.")]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required(ErrorMessage = "Konum bilgisi zorunludur.")]
    [StringLength(200)]
    public string Location { get; set; } = string.Empty;

    public DateTime? PurchaseDate { get; set; }
    public string? Supplier { get; set; }
    public DateTime? WarrantyEndDate { get; set; }

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "Aktif";

    public string? Notes { get; set; }
}
