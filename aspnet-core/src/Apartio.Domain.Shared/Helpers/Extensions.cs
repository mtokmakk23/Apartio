using Allegory.Standart.Filter.Concrete;
using Allegory.Standart.Filter.Enums;

using Apartio.Enums;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Authorization;
using Volo.Abp.Security.Claims;
using Volo.Abp.Users;
using static Volo.Abp.Identity.Settings.IdentitySettingNames;


namespace Apartio.Helpers
{
    public static class Extensions
    {
        private static IAuthorizationService _authorizationService;
        private static IHttpContextAccessor _httpContextAccessor;
        public static void Configure(IHttpContextAccessor httpContextAccessor, IAuthorizationService authorizationService)
        {
            _httpContextAccessor = httpContextAccessor;
            _authorizationService = authorizationService;
        }
        public static void Authorize(List<string> permissions)
        {
            var user = _httpContextAccessor?.HttpContext?.User;
            if (user == null) throw new AbpAuthorizationException();


            foreach (var permission in permissions)
            {
                if (permission.Contains("CustomerPermGroup") && _authorizationService.AuthorizeAsync(user, "AdminPermGroup.CustomerAllPermission").Result.Succeeded)
                {
                    return;
                }
                var result = _authorizationService.AuthorizeAsync(user, permission).Result;

                if (result.Succeeded)
                    return;
            }
#if Release
            throw new AbpAuthorizationException();
#endif
        }
        public static bool AuthorizeBool(List<string> permissions)
        {
            var user = _httpContextAccessor?.HttpContext?.User;
            if (user == null) throw new AbpAuthorizationException();


            foreach (var permission in permissions)
            {
                if (permission.Contains("CustomerPermGroup") && _authorizationService.AuthorizeAsync(user, "AdminPermGroup.CustomerAllPermission").Result.Succeeded)
                {
                    return true;
                }
                var result = _authorizationService.AuthorizeAsync(user, permission).Result;

                if (result.Succeeded)
                    return true;
            }
            return false;
        }
        public static string GetCustomerNo()
        {

            var user = _httpContextAccessor?.HttpContext?.User;
            if (user == null) throw new AbpAuthorizationException();

            var customer = user.Claims.ToList().FirstOrDefault(x => x.Type == "CustomerNo");
            if (customer == null)
            {
                return "";
            }
            else
            {

                return customer.Value;
            }

        }
        public static string GetEmailTemplate(string domain, string title, string header, string body, string uiUrl)
        {

            return $@"<table class=""main"" width=""100%"" cellpadding=""0"" cellspacing=""0"" itemprop=""action"" itemscope="""" itemtype=""http://schema.org/ConfirmAction"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;"">
                                                <tbody><tr style=""font-family: 'Roboto', sans-serif; font-size: 14px; margin: 0;"">
                                                    <td class=""content-wrap"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; color: #495057; font-size: 14px; vertical-align: top; margin: 0;padding: 30px; box-shadow: 0 3px 15px rgba(30,32,37,.06); ;border-radius: 7px; background-color: #fff;"" valign=""top"">
                                                        <meta itemprop=""name"" content=""Confirm Email"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"">
                                                        <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"">
                                                            <tbody><tr style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"">
                                                                <td class=""content-block"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"" valign=""top"">
                                                                    <div style=""margin-bottom: 15px;"">
                                                                        <img src=""{domain}/images/logo/leptonx/email-logo.png"" alt="""" height=""23"">
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"">
                                                                <td class=""content-block"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 20px; line-height: 1.5; font-weight: 500; vertical-align: top; margin: 0; padding: 0 0 10px;"" valign=""top"">
                                                                   {title}
                                                                </td>
                                                            </tr>
                                                            <tr style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"">
                                                                <td class=""content-block"" style=""font-family: 'Roboto', sans-serif; color: #878a99; box-sizing: border-box; line-height: 1.5; font-size: 15px; vertical-align: top; margin: 0; padding: 0 0 10px;"" valign=""top"">
                                                                    {header}
                                                                </td>
                                                            </tr>
                                                            <tr style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"">
                                                                <td class=""content-block"" style=""font-family: 'Roboto', sans-serif; color: #878a99; box-sizing: border-box; line-height: 1.5; font-size: 15px; vertical-align: top; margin: 0; padding: 0 0 24px;"" valign=""top"">
                                                                           {body}                                                                      
                                                                </td>
                                                            </tr>
                                                            <tr style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"">
                                                                <td class=""content-block"" itemprop=""handler"" itemscope="""" itemtype=""http://schema.org/HttpActionHandler"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 24px;"" valign=""top"">
                                                                    <a href=""{uiUrl}"" itemprop=""url"" style=""font-family: 'Roboto', sans-serif; box-sizing: border-box; font-size: .8125rem;font-weight: 400; color: #FFF; text-decoration: none; text-align: center; cursor: pointer; display: inline-block; border-radius: .25rem; text-transform: capitalize; background-color: #0ab39c; margin: 0; border-color: #0ab39c; border-style: solid; border-width: 1px; padding: .5rem .9rem;"" onmouseover=""this.style.background='#099885'"" onmouseout=""this.style.background='#0ab39c'"">Portala Git →</a>
                                                                </td>
                                                            </tr>

                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>";

        }
       
        public static string MD5Hash(string input)
        {
            // MD5 nesnesi oluştur
            using (MD5 md5 = MD5.Create())
            {
                // Metni byte dizisine çevir
                byte[] inputBytes = Encoding.UTF8.GetBytes(input);

                // Hash işlemini uygula
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Byte dizisini hex stringe çevir
                StringBuilder sb = new StringBuilder();
                foreach (byte b in hashBytes)
                {
                    sb.Append(b.ToString("x2")); // Hex formatı
                }

                return sb.ToString();
            }
        }

       

        public static string RenameLoadingRequestStatuEnum(LoadingRequestStatus status)
        {
            if (status==LoadingRequestStatus.Iptal_Edildi)
            {
                return "İPTAL EDİLDİ";
            }
            if (status == LoadingRequestStatus.Musteri_Onayi_Bekleniyor)
            {
                return "MÜŞTERİ ONAYI BEKLENİYOR";
            }
            if (status == LoadingRequestStatus.Fabrika_Onayi_Bekleniyor)
            {
                return "FABRİKA ONAYI BEKLENİYOR";
            }
            if (status == LoadingRequestStatus.Onaylandi)
            {
                return "ONAYLANDI";
            }
            if (status == LoadingRequestStatus.Yuklendi)
            {
                return "YÜKLENDİ";
            }
            return "";
        }
    }
}
