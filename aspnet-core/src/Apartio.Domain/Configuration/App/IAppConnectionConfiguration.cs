using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.Configuration.App
{
    public interface IAppConnectionConfiguration
    {
        public string SelfUrl { get; set; }
        public string ClientUrl { get; set; }
    }
}
