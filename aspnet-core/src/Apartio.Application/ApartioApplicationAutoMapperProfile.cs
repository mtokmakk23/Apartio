using Apartio.DuesTransactions;
using Apartio.Expenses;
using Apartio.FloorResidents;
using Apartio.Housings;
using AutoMapper;

namespace Apartio;

public class ApartioApplicationAutoMapperProfile : Profile
{
	public ApartioApplicationAutoMapperProfile()
	{

		CreateMap<Housing, HousingDto>().ReverseMap();
		CreateMap<Housing, CreateOrUpdateHousing>().ReverseMap();

		CreateMap<Block, BlockDto>().ReverseMap();
		CreateMap<Block, CreateOrUpdateBlock>().ReverseMap();

		CreateMap<Circle, CircleDto>().ReverseMap();
		CreateMap<Circle, CreateOrUpdateCircle>().ReverseMap();

		CreateMap<FloorResident, FloorResidentDto>().ReverseMap();
		CreateMap<FloorResident, CreateOrUpdateFloorResident>().ReverseMap();

		CreateMap<DuesTransaction, DuesTransactionDto>().ReverseMap();
		CreateMap<DuesTransaction, CreateOrUpdateDuesTransaction>().ReverseMap();

		CreateMap<Expense, ExpenseDto>().ReverseMap();
		CreateMap<Expense, CreateOrUpdateExpense>().ReverseMap();

	}
}
