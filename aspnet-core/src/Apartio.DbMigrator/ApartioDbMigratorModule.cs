using Apartio.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Apartio.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(ApartioEntityFrameworkCoreModule),
    typeof(ApartioApplicationContractsModule)
    )]
public class ApartioDbMigratorModule : AbpModule
{
}
