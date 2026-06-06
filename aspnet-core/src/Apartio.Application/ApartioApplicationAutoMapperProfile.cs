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
       
    }
}
