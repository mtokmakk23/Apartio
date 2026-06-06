using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.ObjectExtending;

namespace Apartio.Housings
{
    public class CreateOrUpdateBlock : ExtensibleObject
    {
        public string BlockName { get; set; }
    }
}
