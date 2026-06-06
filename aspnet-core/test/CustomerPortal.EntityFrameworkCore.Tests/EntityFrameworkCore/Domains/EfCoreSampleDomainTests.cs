using CustomerPortal.Samples;
using Xunit;

namespace CustomerPortal.EntityFrameworkCore.Domains;

[Collection(CustomerPortalTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<CustomerPortalEntityFrameworkCoreTestModule>
{

}
