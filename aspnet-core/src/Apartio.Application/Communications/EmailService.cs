using Apartio.Configuration.Communication;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Apartio.Communications
{
    public class EmailService : ApartioAppService, IEmailService
    {
        private readonly IEmailConnectionConfiguration _emailConnectionConfiguration;

        public EmailService(IEmailConnectionConfiguration emailConnectionConfiguration)
        {
            _emailConnectionConfiguration = emailConnectionConfiguration;
        }

        public async Task SendMail(string subject, string body, string[] to, bool isSendYourself = false)
        {
            var smtpClient = new SmtpClient(_emailConnectionConfiguration.Smtp)
            {
                Port = Convert.ToInt32(_emailConnectionConfiguration.Port),
                Credentials = new NetworkCredential(_emailConnectionConfiguration.UserName, _emailConnectionConfiguration.Password),
                EnableSsl = Convert.ToBoolean(_emailConnectionConfiguration.EnableSsl),
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailConnectionConfiguration.UserName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(string.Join(",", to));
            if (isSendYourself)
            {
                mailMessage.To.Add(_emailConnectionConfiguration.UserName);
            }
            smtpClient.Send(mailMessage);
        }
        public async Task SendMailWithAttacment(string subject, string body, string[] to,string base64FileContent, string fileName,bool isSendYourself=false)
        {

            byte[] fileBytes = Convert.FromBase64String(base64FileContent);

            using (var memoryStream = new MemoryStream(fileBytes))
            {
                var smtpClient = new SmtpClient(_emailConnectionConfiguration.Smtp)
                {
                    Port = Convert.ToInt32(_emailConnectionConfiguration.Port),
                    Credentials = new NetworkCredential(_emailConnectionConfiguration.UserName, _emailConnectionConfiguration.Password),
                    EnableSsl = Convert.ToBoolean(_emailConnectionConfiguration.EnableSsl),
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailConnectionConfiguration.UserName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(string.Join(",", to));
                if (isSendYourself)
                {
                    mailMessage.To.Add(_emailConnectionConfiguration.UserName);
                }
                memoryStream.Position = 0; // Akışın başına dön
                var attachment = new Attachment(memoryStream, fileName);
                mailMessage.Attachments.Add(attachment);


                smtpClient.Send(mailMessage);
            }
        }
    }
}
