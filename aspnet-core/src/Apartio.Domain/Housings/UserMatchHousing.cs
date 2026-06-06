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

        public UserMatchHousing(Guid userId, Guid housingId)
        {
            UserId = userId;
            HousingId = housingId;
        }


    }
}
