
using Castle.Core.Resource;
using Apartio.Communications;
using Apartio.Configuration.App;

using Apartio.Helpers;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Reporting.NETCore;
using Microsoft.VisualBasic;
using Newtonsoft.Json;

using Org.BouncyCastle.Utilities;
using Spire.Xls;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Security.Claims;
using Volo.Abp.Users;
using static IdentityServer4.Models.IdentityResources;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Apartio.Controllers;

public class HomeController : AbpController
{

    private readonly IAppConnectionConfiguration _appConnectionConfiguration;

    protected readonly IEmailService _emailService;
    private readonly IMemoryCache _memoryCache;
    private readonly ICurrentUser _currentUser;
    private readonly ICurrentPrincipalAccessor _principalAccessor;
    private readonly IdentityUserManager _userManager;
    private readonly IIdentityUserRepository _identityUserRepository;

    public HomeController(  IAppConnectionConfiguration appConnectionConfiguration, IEmailService emailService, IMemoryCache memoryCache, ICurrentUser currentUser, ICurrentPrincipalAccessor principalAccessor, IdentityUserManager userManager, IIdentityUserRepository identityUserRepository)
    {
      
        _appConnectionConfiguration = appConnectionConfiguration;
       
        _emailService = emailService;
        _memoryCache = memoryCache;
        _currentUser = currentUser;
        _principalAccessor = principalAccessor;
        _userManager = userManager;
        _identityUserRepository = identityUserRepository;
    }

    public async Task<ActionResult> Index()
    {
       
        return Redirect("~/swagger");
    }

  

    public async Task<object> ResetPassword(string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return new
            {
                success = false,
                message = "Email Adresi Boş Geçilemez!"
            };
        }
        var user = (await _identityUserRepository.GetListAsync(emailAddress:email)).FirstOrDefault();
        if (user != null) {
            var password = GeneratePassword();
            await _userManager.RemovePasswordAsync(user);
            var result = await _userManager.AddPasswordAsync(user, password);
            var icerik = Extensions.GetEmailTemplate(_appConnectionConfiguration.SelfUrl, "", string.Join(" ", "Sayın", "<b>", user.Name, user.Surname, "</b>"),
  $@"
Talebiniz doğrultusunda kullanıcı hesabınıza ait şifre sıfırlama işlemi gerçekleştirilmiştir.<br/><br/>

Yeni giriş bilgileriniz aşağıda yer almaktadır:<br/><br/>

Kullanıcı Adı: <b>{email}</b><br/>
Yeni Şifre: <b>{password}</b><br/><br/>

Güvenliğiniz açısından sisteme giriş yaptıktan sonra şifrenizi değiştirmenizi önemle tavsiye ederiz. Şifrenizi üçüncü kişilerle paylaşmamanız ve güçlü bir parola belirlemeniz hesap güvenliğiniz açısından kritik önem taşımaktadır.<br/><br/>

Herhangi bir sorun yaşamanız durumunda bizimle iletişime geçebilirsiniz.<br/><br/>

İyi çalışmalar dileriz.<br/><br/>

Saygılarımızla...<br/><br/>
",
   _appConnectionConfiguration.ClientUrl);
            await _emailService.SendMail("Şifre Sıfırlama", icerik, new List<string>() { email }.ToArray());
            return new
            {
                success = true,
                message = "Şifreniz Sıfırlanıp Yeni Şifreniz Mail Adresinize Gönderilmiştir!"
            };
        }
        else
        {
            return new
            {
                success = false,
                message = "Kullanıcı Bulunamadı!"
            };
        }

       

       
        //if (!result.Succeeded)
        //{
        //    return BadRequest(result.Errors);
        //}
        //var claims = new List<Claim>
        //{
        //    new Claim(AbpClaimTypes.UserId, "109668CA-C551-B6B2-C2AD-3A19B929B8F9"),
        //    new Claim(AbpClaimTypes.UserName, "admin"),
        //    new Claim(AbpClaimTypes.Role, "admin"),
        //};

        //var identity = new ClaimsIdentity(claims, "TestAuthType");
        //var principal = new ClaimsPrincipal(identity);

        //using (_principalAccessor.Change(principal))
        //{
        //    // Burada artık admin gibi davranır
        //    // ApplicationService çağırabilirsin
        //    await _emailService.SendMail("deneme","deneme",new List<string>() { "mehmettokmak184@gmail.com"}.ToArray());
        //}

    }


    public static string GeneratePassword(int length = 8)
    {
        if (length < 4)
            throw new ArgumentException("Şifre uzunluğu en az 4 olmalıdır.");

        const string upperChars = "ABCDEFGHJKLMNOPRSTUV";
        const string lowerChars = "abcdefghjklmnoprstuv";
        const string numberChars = "0123456789";
        const string specialChars = "*-+,.";

        string allChars = upperChars + lowerChars + numberChars + specialChars;

        var password = new StringBuilder();
        var random = RandomNumberGenerator.Create();

        // Her karakter grubundan en az 1 tane ekleyelim
        password.Append(GetRandomChar(upperChars, random));
        password.Append(GetRandomChar(lowerChars, random));
        password.Append(GetRandomChar(numberChars, random));
        password.Append(GetRandomChar(specialChars, random));

        // Kalan karakterleri rastgele dolduralım
        for (int i = password.Length; i < length; i++)
        {
            password.Append(GetRandomChar(allChars, random));
        }

        // Karakterlerin sırasını karıştıralım
        return new string(password
            .ToString()
            .OrderBy(x => GetRandomInt(random))
            .ToArray());
    }

    private static char GetRandomChar(string chars, RandomNumberGenerator rng)
    {
        byte[] data = new byte[4];
        rng.GetBytes(data);
        int value = BitConverter.ToInt32(data, 0) & int.MaxValue;
        return chars[value % chars.Length];
    }

    private static int GetRandomInt(RandomNumberGenerator rng)
    {
        byte[] data = new byte[4];
        rng.GetBytes(data);
        return BitConverter.ToInt32(data, 0);
    }
}
