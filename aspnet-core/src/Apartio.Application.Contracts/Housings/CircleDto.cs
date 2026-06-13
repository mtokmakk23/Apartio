using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace Apartio.Housings
{
    public class CircleDto : EntityDto<Guid>
    {
        public Guid BlockId { get; set; }
        public string CircleName { get; set; }
        public Guid? HomeOwnerId { get; set; }
        public Guid? HirerId { get; set; }
    }
}
