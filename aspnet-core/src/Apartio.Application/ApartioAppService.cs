using System;
using System.Collections.Generic;
using System.Text;
using Apartio.Localization;
using Volo.Abp.Application.Services;

namespace Apartio;

/* Inherit your application services from this class.
 */
public abstract class ApartioAppService : ApplicationService
{
    protected ApartioAppService()
    {
        LocalizationResource = typeof(ApartioResource);
    }
}
