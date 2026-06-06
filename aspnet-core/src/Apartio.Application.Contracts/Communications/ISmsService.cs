using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.Communications
{
    public interface ISmsService
    {
        Task SendSms(string Metin, string Gsm);
    }
}
