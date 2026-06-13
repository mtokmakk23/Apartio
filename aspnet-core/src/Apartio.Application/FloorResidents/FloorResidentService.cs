using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Apartio.DuesTransactions;

namespace Apartio.FloorResidents
{
    [Authorize] 
    public class FloorResidentService : ApartioAppService, IFloorResidentAppService
    {
        private readonly IFloorResidentRepository _floorResidentRepository;
        private readonly IHousingAppService _housingAppService;
        private readonly IDuesTransactionRepository _duesTransactionRepository;

        public FloorResidentService(IFloorResidentRepository floorResidentRepository, IDuesTransactionRepository duesTransactionRepository, IHousingAppService housingAppService)
        {
            _floorResidentRepository = floorResidentRepository;
            _duesTransactionRepository = duesTransactionRepository;
            _housingAppService = housingAppService;
        }

        public async Task CreateFloorResidentAsync(CreateOrUpdateFloorResident prop)
        {
            var housing = await _housingAppService.GetSelectedHousingAsync();
            var property = new FloorResident(housing.Id, prop.Name, prop.Surname, prop.Phone, prop.Email, prop.IsActive, prop.Identity);
            await _floorResidentRepository.InsertAsync(property, autoSave: true);
        }

        public async Task DeleteFloorResidentAsync(Guid id)
        {
            await _floorResidentRepository.DeleteAsync(id, autoSave: true);
        }

        public async Task<FloorResidentDto> GetFloorResidentAsync(Guid id)
        {
            var floorResident = await _floorResidentRepository.GetAsync(id);
            return ObjectMapper.Map<FloorResident, FloorResidentDto>(floorResident);
        }

        public async Task<List<FloorResidentDto>> GetFloorResidentListAsync()
        {
            var housing = await _housingAppService.GetSelectedHousingAsync();
            var floorResidents = await _floorResidentRepository.GetListAsync(x=>x.HousingId == housing.Id);
            return floorResidents.Select(ObjectMapper.Map<FloorResident, FloorResidentDto>).ToList();
        }

        public async Task UpdateFloorResidentAsync(Guid id, CreateOrUpdateFloorResident prop)
        {
            var property = await _floorResidentRepository.GetAsync(id);
            property.SetName(prop.Name);
            property.SetSurname(prop.Surname);
            property.SetIdentity(prop.Identity);
            property.Phone = prop.Phone;
            property.Email = prop.Email;
            property.IsActive = prop.IsActive;
            await _floorResidentRepository.UpdateAsync(property, autoSave: true);
        }

        public async Task<List<FloorResidentExtract>> GetExtract(Guid FloorResidentId)
        {
            var housing = await _housingAppService.GetSelectedHousingAsync();
            var aidatlar = await _duesTransactionRepository.GetListAsync(x => x.FloorResidentId == FloorResidentId && x.HousingId == housing.Id);
            var aidatborclari = aidatlar.Where(x => x.Sing==0).OrderBy(x=>x.Date_).ToList();
            var aidatOdemeleri = aidatlar.Where(x => x.Sing==1).OrderBy(x => x.Date_).ToList();
            var list = new List<FloorResidentExtract>();

            foreach (var aidatborcu in aidatborclari)
            {
                var extract = new FloorResidentExtract();
                extract.DueDate = aidatborcu.DueDate;
                extract.Date_ = aidatborcu.Date_;
                extract.Note = aidatborcu.Note;
                extract.Debit = aidatborcu.Price;
                extract.DelayDebitPrice = 0;
                extract.Credit = 0;
                extract.Balance = 0;
                extract.Remainder = aidatborcu.Price;
                foreach (var odeme in aidatOdemeleri.Where(x=>x.Price>0))
                {
                    if (aidatborcu.DueDate.HasValue)
                    {
                        if (aidatborcu.DueDate.Value.Date>odeme.Date_.Date)
                        {
                            if (housing.IsDelayCompensation)
                            {
                                var delayDays = (odeme.Date_.Date - aidatborcu.DueDate.Value.Date).Days;
                                var gecikmeBedeli= extract.Remainder*(100/ housing.DelayCompensationRate)/ 30 * delayDays;
                                extract.Remainder += gecikmeBedeli;
                                extract.DelayDebitPrice += gecikmeBedeli;
                                if (extract.Remainder >= odeme.Price)
                                {
                                    extract.Remainder -= odeme.Price;
                                    odeme.Price = 0;
                                }
                                else
                                {
                                    odeme.Price -= extract.Remainder;
                                    extract.Remainder = 0;
                                }
                            }
                            else
                            {
                                if (extract.Remainder >= odeme.Price)
                                {
                                    extract.Remainder -= odeme.Price;
                                    odeme.Price = 0;
                                }
                                else
                                {
                                    odeme.Price -= extract.Remainder;
                                    extract.Remainder = 0;
                                }
                            }
                        }
                        else
                        {
                            if (extract.Remainder >= odeme.Price)
                            {
                                extract.Remainder -= odeme.Price;
                                odeme.Price = 0;
                            }
                            else
                            {
                                odeme.Price -= extract.Remainder;
                                extract.Remainder = 0;
                            }
                        }
                    }
                }
                list.Add(extract);
            }
            foreach (var odeme in aidatOdemeleri)
            {
                var extract = new FloorResidentExtract();
                extract.DueDate = odeme.DueDate;
                extract.Date_ = odeme.Date_;
                extract.Note = odeme.Note;
                extract.Debit = 0;
                extract.DelayDebitPrice = 0;
                extract.Credit = odeme.Price;
                extract.Balance = 0;
                extract.Remainder = 0;
                list.Add(extract);
            }
            decimal balance = 0;
            foreach (var item in list)
            {
                balance += item.Credit - item.Debit - item.DelayDebitPrice;
                item.Balance = balance;
            }
            return list.OrderBy(x => x.Date_).ToList();
        }
    }
}
