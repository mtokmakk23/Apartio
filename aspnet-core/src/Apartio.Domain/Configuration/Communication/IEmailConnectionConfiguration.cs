using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.Configuration.Communication
{
    public interface IEmailConnectionConfiguration
    {
        public string Smtp { get; set; }
        public string Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string EnableSsl { get; set; }
        public string UseDefaultCredentials { get; set; }
    }
}
