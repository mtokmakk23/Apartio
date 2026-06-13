using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;

namespace Apartio.Housings
{
    public class HousingDto : EntityDto<Guid>
    {
        public string Name { get; init; }
        public string City { get; init; }
        public string Town { get; init; }
        public string? Adress { get; init; }
        public string? PostalCode { get; init; }
        public string? Email { get; init; }
        public string? Phone { get; init; }
        public string? Type { get; init; }
        public bool IsDelayCompensation { get; protected set; }
        public decimal DelayCompensationRate { get; protected set; }
        public int LastPaymentDay { get; set; }

    }
}
