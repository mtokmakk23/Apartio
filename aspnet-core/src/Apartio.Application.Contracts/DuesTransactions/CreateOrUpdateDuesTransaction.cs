using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.ObjectExtending;

namespace Apartio.DuesTransactions
{
    public class CreateOrUpdateDuesTransaction : ExtensibleObject
    {
        public Guid HousingId { get; set; }
        public Guid? BlockId { get; set; }
        public Guid? CircleId { get; set; }
        public Guid? FloorResidentId { get; set; }
        public decimal Price { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public DateTime Date_ { get; set; }
        public decimal DelayCompensationRate { get; set; }
        public string Type { get; set; }
        public int Sing { get; set; }
        public string? Note { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
