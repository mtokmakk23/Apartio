using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Housings
{
    public class UserMatchHousing : AuditedAggregateRoot<int>
    {
        public Guid UserId { get; set; }
        public Guid HousingId { get; set; }
        public Guid? BlockId { get; set; }

        protected UserMatchHousing()
        {
        }

        public UserMatchHousing(Guid userId, Guid housingId, Guid? blockId = null)
        {
            UserId = userId;
            HousingId = housingId;
            BlockId = blockId;
        }


    }
}
