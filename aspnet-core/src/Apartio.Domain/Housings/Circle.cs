using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Housings
{
    public class Circle : AuditedAggregateRoot<Guid>, ISoftDelete
    {
        public bool IsDeleted { get; set; }
        public Guid BlockId { get; set; }
        public string CircleName { get; set; }
        public Guid? HomeOwnerId { get; set; }
        public Guid? HirerId { get; set; }

        public Circle(Guid blockId, string circleName, Guid? homeOwnerId, Guid? hirerId)
        {
            BlockId = blockId;
            SetCircleName(circleName);
            HomeOwnerId = homeOwnerId;
            HirerId = hirerId;
        }

        public void SetCircleName(string circleName)
        {
            if (string.IsNullOrEmpty(circleName))
            {
                throw new UserFriendlyException("Daire adı boş olamaz!");
            }
            CircleName = circleName;
        }
    }
}

