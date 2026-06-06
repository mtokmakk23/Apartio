using Apartio.Housings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace Apartio.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class ApartioDbContextFactory : IDesignTimeDbContextFactory<ApartioDbContext>
{

    public ApartioDbContextFactory()
    {
    }

    public ApartioDbContext CreateDbContext(string[] args)
    {
        ApartioEfCoreEntityExtensionMappings.Configure();

        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<ApartioDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));

        return new ApartioDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Apartio.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}
