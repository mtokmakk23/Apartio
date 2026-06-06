using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apartio.Communications
{
    public interface IEmailService:IApplicationService
    {
        Task SendMail(string subject, string body, string[] to, bool isSendYourself = false);
        Task SendMailWithAttacment(string subject, string body, string[] to, string base64FileContent, string fileName, bool isSendYourself = false);
    }
}
