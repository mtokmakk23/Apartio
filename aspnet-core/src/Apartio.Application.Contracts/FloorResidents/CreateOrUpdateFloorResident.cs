using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.ObjectExtending;

namespace Apartio.FloorResidents
{
    public class CreateOrUpdateFloorResident : ExtensibleObject
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public string? Identity { get; set; }
    }
}
