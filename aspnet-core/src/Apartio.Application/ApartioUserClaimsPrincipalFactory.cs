using Apartio.Users;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;

namespace Apartio
{
    [Dependency(ReplaceServices = true)]
    public class ApartioUserClaimsPrincipalFactory : IAbpClaimsPrincipalContributor, ITransientDependency
    {
        private readonly IIdentityUserAppService IdentityUserAppService;

        public ApartioUserClaimsPrincipalFactory(IIdentityUserAppService identityUserAppService)
        {

            IdentityUserAppService = identityUserAppService;
        }

        public async Task ContributeAsync(AbpClaimsPrincipalContributorContext context)
        {
            var identity = context.ClaimsPrincipal.Identities.FirstOrDefault();
            var userId = identity?.FindUserId();

            if (userId.HasValue)
            {
                var extraProperties = (await IdentityUserAppService.GetAsync((Guid)userId)).ExtraProperties;

                var customerNo = extraProperties.FirstOrDefault(x => x.Key == nameof(UserExtraProperties.CustomerNo)).Value.ToString();
                var isAdmin = extraProperties.FirstOrDefault(x => x.Key == nameof(UserExtraProperties.IsAdmin)).Value.ToString();


                identity.AddOrReplace(new Claim(nameof(UserExtraProperties.CustomerNo), customerNo));
                identity.AddOrReplace(new Claim(nameof(UserExtraProperties.IsAdmin), isAdmin));


                context.ClaimsPrincipal.AddIdentityIfNotContains(identity);
            }

        }

    }
}
