using Volo.Abp.Modularity;

namespace CustomerPortal;

[DependsOn(
    typeof(CustomerPortalDomainModule),
    typeof(CustomerPortalTestBaseModule)
)]
public class CustomerPortalDomainTestModule : AbpModule
{

}
