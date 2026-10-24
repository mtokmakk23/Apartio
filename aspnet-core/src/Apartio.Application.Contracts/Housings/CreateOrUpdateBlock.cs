using System.ComponentModel;
using Volo.Abp.ObjectExtending;

namespace Apartio.Housings;

public class CreateOrUpdateBlock : ExtensibleObject
{
    [DisplayName("Blok Adı")]
    public string BlockName { get; set; } = string.Empty;

    [DisplayName("Asansör Sayısı")]
    public byte ElevatorCount { get; set; }

    [DisplayName("Toplam Kat Sayısı")]
    public byte TotalFloors { get; set; }
}
