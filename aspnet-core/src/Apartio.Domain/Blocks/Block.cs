using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Blocks
{
    public class Block : AuditedAggregateRoot<Guid>, ISoftDelete
    {
        public bool IsDeleted {  get; set; }
        public Guid HousingId { get; set; }

        public string BlockName { get; set; }

     
    }
}
