using Apartio.DuesTransactions;
using Apartio.FloorResidents;
using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Volo.Abp;

namespace Apartio.DuesTransactions
{
    [Authorize]
    public class DuesTransactionService : ApartioAppService, IDuesTransactionAppService
    {
        private readonly IDuesTransactionRepository _duesTransactionRepository;
        private readonly IHousingAppService _housingAppService;

        public DuesTransactionService(IDuesTransactionRepository repository, IHousingAppService housingAppService)
        {
            _duesTransactionRepository = repository;
            _housingAppService = housingAppService;
        }

        public async Task CreateDuesTransactionAsync(CreateOrUpdateDuesTransaction prop)
        {
            if (prop.Price<=0)
            {
                throw new UserFriendlyException("Tutar 0(Sıfır)'dan Fazla Olmalıdır.");
            }
            var housing = await _housingAppService.GetSelectedHousingAsync();
            var property = new DuesTransaction(housing.Id, prop.BlockId, prop.CircleId, prop.FloorResidentId, prop.Price, prop.Month, prop.Year, prop.Date_, prop.DelayCompensationRate, prop.Type, prop.Sing, prop.Note, prop.DueDate);
            await _duesTransactionRepository.InsertAsync(property, autoSave: true);
        }

        public async Task DeleteDuesTransactionAsync(Guid id)
        {
            await _duesTransactionRepository.DeleteAsync(id);
        }

        public async Task<DuesTransactionDto> GetDuesTransactionAsync(Guid id)
        {
            var property = await _duesTransactionRepository.GetAsync(id);
            return ObjectMapper.Map<DuesTransaction, DuesTransactionDto>(property);
        
        }

        public async Task<List<DuesTransactionDto>> GetDuesTransactionListAsync()
        {
            var housing = await _housingAppService.GetSelectedHousingAsync();
            var properties = await _duesTransactionRepository.GetListAsync(x=>x.HousingId==housing.Id);
            return properties.Select(ObjectMapper.Map<DuesTransaction, DuesTransactionDto>).ToList();
        }

        public async Task UpdateDuesTransactionAsync(Guid id, CreateOrUpdateDuesTransaction prop)
        {
            var housing = await _housingAppService.GetSelectedHousingAsync();

            var property = await _duesTransactionRepository.GetAsync(id);
            ObjectMapper.Map(prop, property);
            property.HousingId = housing.Id;

            await _duesTransactionRepository.UpdateAsync(property, autoSave: true);
        
        }
    }
}
