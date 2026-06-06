using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace Apartio.Housings
{
    public class BlockDto : EntityDto<Guid>
    {
        public Guid HousingId { get; set; }
        public string BlockName { get; set; }
    }
}
