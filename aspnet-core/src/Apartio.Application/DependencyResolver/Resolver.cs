using Apartio.Communications;
using Apartio.Configuration.App;
using Apartio.Configuration.Communication;
using Apartio.Configuration.General;

using IdentityServer4.Services;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Authorization;
using Volo.Abp.ExceptionHandling;

namespace Apartio.DependencyResolver
{
    public static class Resolver
    {
        public static void ResolveApp(this IServiceCollection serviceProvider)
        {
            ResolveLogoConfigurations(serviceProvider);


           
            serviceProvider.AddSingleton<IEmailService, EmailService>();
            serviceProvider.AddSingleton<ISmsService, SmsService>();
 

        }

        private static void ResolveLogoConfigurations(IServiceCollection serviceProvider)
        {

            serviceProvider.AddSingleton(o =>
            {
                var configuration = o.GetService<IConfiguration>();
                var Config = new AppConnectionConfiguration();
                configuration.Bind("App", Config);
                return (IAppConnectionConfiguration)Config;
            });

           
            serviceProvider.AddSingleton(o =>
            {
                var configuration = o.GetService<IConfiguration>();
                var Config = new GeneralConnectionConfiguration();
                configuration.Bind("Params", Config);
                return (IGeneralConnectionConfiguration)Config;
            });
            serviceProvider.AddSingleton(o =>
            {
                var configuration = o.GetService<IConfiguration>();
                var Config = new EmailConnectionConfiguration();
                configuration.Bind("EmailSettings", Config);
                return (IEmailConnectionConfiguration)Config;
            });
            serviceProvider.AddSingleton(o =>
            {
                var configuration = o.GetService<IConfiguration>();
                var Config = new SmsConnectionConfiguration();
                configuration.Bind("SmsSettings", Config);
                return (ISmsConnectionConfiguration)Config;
            });
           

        }
    }
}
