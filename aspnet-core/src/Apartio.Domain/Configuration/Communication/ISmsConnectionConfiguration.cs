using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.Configuration.Communication
{
    public interface ISmsConnectionConfiguration
    {
        public string Header { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
