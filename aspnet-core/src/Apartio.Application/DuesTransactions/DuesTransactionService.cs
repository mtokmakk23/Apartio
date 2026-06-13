using Apartio.DuesTransactions;
using Apartio.FloorResidents;
using Apartio.Housings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Apartio.DuesTransactions
{
    [Authorize]
    public class DuesTransactionService : ApartioAppService, IDuesTransactionAppService
    {
        private readonly IDuesTransactionRepository _duesTransactionRepository;

        public DuesTransactionService(IDuesTransactionRepository repository)
        {
            _duesTransactionRepository = repository;
        }

        public async Task CreateDuesTransactionAsync(CreateOrUpdateDuesTransaction prop)
        {
            var property = new DuesTransaction(prop.HousingId, prop.BlockId, prop.CircleId, prop.FloorResidentId, prop.Price, prop.Month, prop.Year, prop.Date_, prop.DelayCompensationRate, prop.Type, prop.Sing, prop.Note, prop.DueDate);
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
            var properties = await _duesTransactionRepository.GetListAsync();
            return properties.Select(ObjectMapper.Map<DuesTransaction, DuesTransactionDto>).ToList();
        }

        public async Task UpdateDuesTransactionAsync(Guid id, CreateOrUpdateDuesTransaction prop)
        {
            var property = await _duesTransactionRepository.GetAsync(id);
            ObjectMapper.Map(prop, property);
            await _duesTransactionRepository.UpdateAsync(property, autoSave: true);
        }
        }
    }
}
