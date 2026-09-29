using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apartio.Housings;

public class Housing : AuditedAggregateRoot<Guid>, ISoftDelete
{
	public bool IsDeleted { get; set; } = false;
	public string Name { get; protected set; }
	public string City { get; protected set; }
	public string Town { get; protected set; }
	public string? Adress { get; protected set; }
	public string? PostalCode { get; protected set; }
	public string? Email { get; protected set; }
	public string? Phone { get; protected set; }
	public int Type { get; protected set; }
	public HousingType? HousingType { get; protected set; }
	public bool IsDelayCompensation { get; protected set; }
	public decimal DelayCompensationRate { get; protected set; }
	public int LastPaymentDay { get; set; }

	protected Housing()
	{
	}

	public Housing(string name, string city, string town, int type, string? adress, string? postalCode, string? email, string? phone, bool isDelayCompensation, decimal delayCompensationRate, int lastPaymentDay)
	{
		setName(name);
		setCity(city);
		setTown(town);
		setType(type);
		setAdress(adress);
		setPostalCode(postalCode);
		setEmail(email);
		setPhone(phone);
		setIsDelayCompensation(isDelayCompensation);
		setDelayCompensationRate(delayCompensationRate);
		LastPaymentDay = lastPaymentDay;
	}

	public void setName(string name)
	{
		if (string.IsNullOrEmpty(name))
		{
			throw new UserFriendlyException($"Konut ismi boş geçilemez");
		}
		Name = name;
	}

	public void setCity(string city)
	{
		if (string.IsNullOrEmpty(city))
		{
			throw new UserFriendlyException($"İl boş geçilemez");
		}
		City = city;
	}

	public void setTown(string town)
	{
		if (string.IsNullOrEmpty(town))
		{
			throw new UserFriendlyException($"İlçe boş geçilemez");
		}
		Town = town;
	}

	public void setType(int type)
	{
		Type = type;
	}

	public void setAdress(string? adress)
	{
		Adress = adress;
	}

	public void setPostalCode(string? postalCode)
	{
		PostalCode = postalCode;
	}

	public void setEmail(string? email)
	{
		Email = email;
	}

	public void setPhone(string? phone)
	{
		Phone = phone;
	}

	public void setIsDelayCompensation(bool isDelayCompensation)
	{
		IsDelayCompensation = isDelayCompensation;
	}

	public void setDelayCompensationRate(decimal delayCompensationRate)
	{
		if (delayCompensationRate < 0)
		{
			throw new UserFriendlyException($"Gecikme tazminatı oranı negatif olamaz");
		}
		DelayCompensationRate = delayCompensationRate;
	}
}