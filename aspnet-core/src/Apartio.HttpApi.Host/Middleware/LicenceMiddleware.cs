using Apartio.Configuration.App;
using Microsoft.AspNetCore.Http;
using RestSharp;
using System;
using System.Threading.Tasks;
using Volo.Abp;

namespace Apartio.Middleware
{
    public class LicenceMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IAppConnectionConfiguration _appConnectionConfiguration;
        public LicenceMiddleware(RequestDelegate next, IAppConnectionConfiguration appConnectionConfiguration)
        {
            _next = next;
            _appConnectionConfiguration = appConnectionConfiguration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
#if !DEBUG
            try
            {
                var options = new RestClientOptions("http://193.38.34.150:8023")
                {


                };
                var client = new RestClient(options);
                var request = new RestRequest("/api/Licence?applicationName=Apartio&domain=" + _appConnectionConfiguration.ClientUrl + "", Method.Get);
                RestResponse response = await client.ExecuteAsync(request);
                if (Convert.ToBoolean(response.Content) == false)
                {
                    throw new UserFriendlyException("Lisansınızın süresi dolmuştur lütfen lisans yenileyiniz.");

                }
            }
            catch (System.Exception ex)
            {
                throw new UserFriendlyException("Lisans Hata detayı:" + ex.ToString());
            }
#endif

            await _next(context);
        }
    }
}
