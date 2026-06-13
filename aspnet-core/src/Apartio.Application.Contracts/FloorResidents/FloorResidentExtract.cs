using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.FloorResidents
{
    public class FloorResidentExtract
    {
        public DateTime Date_ { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Note { get; set; }
        public decimal Debit { get; set; }
        public decimal DelayDebitPrice { get; set; }
        public decimal Credit { get; set; }
        public decimal Balance { get; set; }    
        public decimal Remainder { get; set; }    

    }
}
