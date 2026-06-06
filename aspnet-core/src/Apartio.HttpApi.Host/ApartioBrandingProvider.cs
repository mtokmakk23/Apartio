using Microsoft.Extensions.Localization;
using Apartio.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Apartio;

[Dependency(ReplaceServices = true)]
public class ApartioBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<ApartioResource> _localizer;

    public ApartioBrandingProvider(IStringLocalizer<ApartioResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
