using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.PublicEntities.ExchangeRates
{
    public class ExchangeRateDto
    {
        public decimal USD { get; set; }
        public decimal EUR { get; set; }
        public DateTime UpdateTime { get; set; }
    }
}
