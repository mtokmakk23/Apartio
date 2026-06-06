using Microsoft.Extensions.Localization;
using CustomerPortal.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace CustomerPortal.Blazor.WebApp.Tiered;

[Dependency(ReplaceServices = true)]
public class CustomerPortalBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<CustomerPortalResource> _localizer;

    public CustomerPortalBrandingProvider(IStringLocalizer<CustomerPortalResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
