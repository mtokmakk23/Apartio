using System.Threading.Tasks;

namespace Apartio.Communications;

public interface ISmsService
{
    Task SendSms(string Metin, string Gsm);
}
