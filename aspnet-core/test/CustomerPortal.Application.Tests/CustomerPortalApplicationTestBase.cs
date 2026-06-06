using Volo.Abp.Modularity;

namespace CustomerPortal;

public abstract class CustomerPortalApplicationTestBase<TStartupModule> : CustomerPortalTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
