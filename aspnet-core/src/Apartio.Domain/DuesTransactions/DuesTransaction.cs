using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.DuesTransactions
{
    public class DuesTransaction : AuditedAggregateRoot<Guid>, ISoftDelete
    {
        public bool IsDeleted { get; set; }
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

        public DuesTransaction(Guid housingId, Guid? blockId, Guid? circleId, Guid? floorResidentId, decimal price, int month, int year, DateTime date_, decimal delayCompensationRate, string type, int sing, string? note, DateTime? dueDate)
        {
            HousingId = housingId;
            BlockId = blockId;
            CircleId = circleId;
            FloorResidentId = floorResidentId;
            Price = price;
            Month = month;
            Year = year;
            Date_ = date_;
            DelayCompensationRate = delayCompensationRate;
            Type = type;
            Sing = sing;
            Note = note;
            DueDate = dueDate;
        }
    }
}
