using Volo.Abp.Modularity;

namespace CustomerPortal;

/* Inherit from this class for your domain layer tests. */
public abstract class CustomerPortalDomainTestBase<TStartupModule> : CustomerPortalTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
