using System;

namespace Apartio.Assets;

public class GetAssetListInput
{
    /// <summary>
    /// Ana filtre: Yukarıdan seçilen site parametresi (HousingId).
    /// Belirtilmezse backend oturumdaki seçili siteyi baz alır.
    /// </summary>
    public Guid? HousingId { get; set; }

    /// <summary>
    /// İkinci filtre: Sayfadaki tablo/filtre ile o siteye ait binalar veya bloklar (LocationId).
    /// </summary>
    public Guid? LocationId { get; set; }

    public string? Category { get; set; }

    public string? Status { get; set; }

    public string? Filter { get; set; }
}
