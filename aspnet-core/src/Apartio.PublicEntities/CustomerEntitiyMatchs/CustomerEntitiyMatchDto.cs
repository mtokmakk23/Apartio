using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace Apartio.CustomerEntitiyMatchs
{
    public class CustomerEntitiyMatchDto : EntityDto<Guid>
    {
        public string CustomerCode { get; set; }
        public string CustomerTitle { get; set; }
        public string EntityCode { get; set; }
        public string EntityTitle { get; set; }
    }
}
