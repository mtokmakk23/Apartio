using Apartio.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apartio.Housings;

public class EfCoreHousingTypeRepository : EfCoreRepository<ApartioDbContext, HousingType, int>, IHousingTypeRepository
{
	public EfCoreHousingTypeRepository(IDbContextProvider<ApartioDbContext> dbContextProvider) : base(dbContextProvider)
	{
	}
}
