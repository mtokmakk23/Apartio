using System;
using Volo.Abp.ObjectExtending;

namespace Apartio.Housings
{
    public class CreateOrUpdateUnit : ExtensibleObject
    {
        public Guid BlockId { get; set; }
        public string UnitNumber { get; set; } = string.Empty;
        public string UnitType { get; set; } = "Daire";
        public int Floor { get; set; } = 1;
        public decimal? GrossSquareMeters { get; set; }
        public decimal? NetSquareMeters { get; set; }
        public Guid? HomeOwnerId { get; set; }
        public Guid? HirerId { get; set; }

        // Geriye dönük uyumluluk
        public string CircleName
        {
            get => UnitNumber;
            set => UnitNumber = value;
        }
    }
}
