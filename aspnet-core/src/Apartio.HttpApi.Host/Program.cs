using Apartio.Communications;
using Apartio.EntityFrameworkCore;
using Apartio.Helpers;
using Apartio.Housings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using System;
using System.Threading.Tasks;

namespace Apartio;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
#if DEBUG
            .MinimumLevel.Debug()
#else
            .MinimumLevel.Error()
#endif
            //.MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
            .WriteTo.Async(c => c.Console())
            .CreateLogger();

        try
        {
            Log.Information("Starting Apartio.HttpApi.Host.");
            var builder = WebApplication.CreateBuilder(args);
           
            builder.Services.AddScoped<IEmailService, EmailService>();
           
            builder.Host.AddAppSettingsSecretsJson()
                .UseAutofac()
                .UseSerilog();
            builder.Services.AddControllers(options =>
            {
                options.ValueProviderFactories.Add(new FormValueProviderFactory());
            });
            await builder.AddApplicationAsync<ApartioHttpApiHostModule>();
            var app = builder.Build();
      

            // Servis sağlayıcısını kullanarak gerekli servisleri alın
            var serviceProvider = app.Services;
            var httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
            var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();


            // AuthorizationHelper'ı yapılandırın
            Extensions.Configure(httpContextAccessor, authorizationService);
            await app.InitializeApplicationAsync();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApartioDbContext>();
                dbContext.Database.Migrate();
            }


           

            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
