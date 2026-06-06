using Volo.Abp.Modularity;

namespace CustomerPortal;

[DependsOn(
    typeof(CustomerPortalApplicationModule),
    typeof(CustomerPortalDomainTestModule)
)]
public class CustomerPortalApplicationTestModule : AbpModule
{

}
