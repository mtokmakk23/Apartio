using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.FloorResidents
{
    public class FloorResident : AuditedAggregateRoot<Guid>, ISoftDelete
    {
        public bool IsDeleted { get; set; }
        public Guid HousingId { get; set; }

        public string Name { get; set; }
        public string Surname { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public string? Identity { get; set; }

        public FloorResident(Guid housingId, string name, string surname, string? phone, string? email, bool isActive, string? identity)
        {
            HousingId = housingId;
            SetName(name);
            SetSurname(surname);
            Phone = phone;
            Email = email;
            IsActive = isActive;
            SetIdentity(identity);

        }
        public void SetName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new UserFriendlyException("Ad boş olamaz!");
            }
            Name = name;
        }
        public void SetSurname(string surname)
        {
            if (string.IsNullOrEmpty(surname))
            {
                throw new UserFriendlyException("Soyad boş olamaz!");
            }
            Surname = surname;
        }
        public void SetIdentity(string? identity)
        {
            if (!string.IsNullOrEmpty(identity) && identity.Length < 11)
            {
                throw new UserFriendlyException("Kimlik no 11 karakter olmalıdır!");
            }
            Identity = identity;
        }
    }
}
