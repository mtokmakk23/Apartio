using CustomerPortal.Samples;
using Xunit;

namespace CustomerPortal.EntityFrameworkCore.Applications;

[Collection(CustomerPortalTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<CustomerPortalEntityFrameworkCoreTestModule>
{

}
