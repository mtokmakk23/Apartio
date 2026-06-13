using Apartio.Configuration.Communication;
using Microsoft.AspNetCore.Authorization;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Volo.Abp.Identity.Settings.IdentitySettingNames;

namespace Apartio.Communications
{
    [Authorize]
    public class SmsService : ApartioAppService, ISmsService
    {
        private readonly ISmsConnectionConfiguration _smsConnectionConfiguration;

        public SmsService(ISmsConnectionConfiguration smsConnectionConfiguration)
        {
            _smsConnectionConfiguration = smsConnectionConfiguration;
        }

        public async Task SendSms(string Metin, string Gsm)
        {
            if (string.IsNullOrEmpty(_smsConnectionConfiguration.UserName))
            {
                return;
            }
            var client = new RestClient("http://soap.netgsm.com.tr:8080/Sms_webservis/SMS?wsdl");
            var request = new RestRequest();
            request.Method = RestSharp.Method.Post;
            request.AddHeader("Content-Type", "text/xml");
            var body = @"<?xml version=""1.0""?>
" + "\n" +
            @"<SOAP-ENV:Envelope xmlns:SOAP-ENV=""http://schemas.xmlsoap.org/soap/envelope/""
" + "\n" +
            @"             xmlns:xsd=""http://www.w3.org/2001/XMLSchema""
" + "\n" +
            @"  xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"">
" + "\n" +
            @"    <SOAP-ENV:Body>
" + "\n" +
            @"        <ns3:smsGonder1NV2 xmlns:ns3=""http://sms/"">
" + "\n" +
            @"            <username>" + _smsConnectionConfiguration.UserName + "</username>" +
    "\n" +
            @"            <password>" + _smsConnectionConfiguration.Password + "</password>" +
    "\n" +
            @"            <header>" + _smsConnectionConfiguration.Header + "</header>" +
    "\n" +
            @"            <msg>" + Metin + "</msg>" +
    "\n" +
            @"            <gsm>" + Gsm + "</gsm>" +
    "\n" +
            @"            <encoding>TR</encoding>
" + "\n" +
            @"        </ns3:smsGonder1NV2>
" + "\n" +
            @"    </SOAP-ENV:Body>
" + "\n" +
            @"</SOAP-ENV:Envelope>";
            request.AddParameter("text/xml", body, ParameterType.RequestBody);
            var response =await client.ExecuteAsync(request);

        }

    }
}
