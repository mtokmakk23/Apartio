using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.ObjectExtending;

namespace Apartio.Housings
{
    public class CreateOrUpdateCircle : ExtensibleObject
    {
        public Guid BlockId { get; set; }
        public string CircleName { get; set; }
        public Guid? HomeOwnerId { get; set; }
        public Guid? HirerId { get; set; }
    }
}
