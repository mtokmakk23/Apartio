using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Housings
{
    public class Block : AuditedAggregateRoot<Guid>, ISoftDelete
    {
        public bool IsDeleted { get; set; }
        public Guid HousingId { get; set; }
        public string BlockName { get; set; }

        public Block(Guid housingId, string blockName)
        {
            HousingId = housingId;
            SetBlockName(blockName);
        }

        public void SetBlockName(string blockName)
        {
            if (string.IsNullOrEmpty(blockName))
            {
                throw new UserFriendlyException("Blok adı boş olamaz!");
            }
            BlockName = blockName;
        }

    }
}
