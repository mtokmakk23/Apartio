using CustomerPortal.Localization;
using Volo.Abp.AspNetCore.Components;

namespace CustomerPortal.Blazor.WebApp.Tiered;

public abstract class CustomerPortalComponentBase : AbpComponentBase
{
    protected CustomerPortalComponentBase()
    {
        LocalizationResource = typeof(CustomerPortalResource);
    }
}
