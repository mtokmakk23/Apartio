using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.Configuration.General
{
    public interface IGeneralConnectionConfiguration
    {
        public string OrderPageWarning { get; set; }
        public string CampaingName { get; set; }
        public string UnitConversion { get; set; }
        public bool VatIncluded { get; set; }
        public bool IsStockControl { get; set; }
        public List<string> Banner { get; set; }
    }
}
