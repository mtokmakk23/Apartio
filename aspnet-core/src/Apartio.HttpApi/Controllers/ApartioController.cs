using Apartio.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Apartio.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class ApartioController : AbpControllerBase
{
    protected ApartioController()
    {
        LocalizationResource = typeof(ApartioResource);
    }
}
