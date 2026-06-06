using System.Threading.Tasks;

namespace Apartio.Data;

public interface IApartioDbSchemaMigrator
{
    Task MigrateAsync();
}
