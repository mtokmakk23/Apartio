using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Apartio.Data;

/* This is used if database provider does't define
 * IApartioDbSchemaMigrator implementation.
 */
public class NullApartioDbSchemaMigrator : IApartioDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
