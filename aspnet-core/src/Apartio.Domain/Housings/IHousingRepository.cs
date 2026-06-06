using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Domain.Repositories;

namespace Apartio.Housings
{
    public interface IHousingRepository : IRepository<Housing, Guid>
    {
    }
}
