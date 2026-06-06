using Apartio.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Apartio.Permissions;

public class ApartioPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myAdminGroup = context.AddGroup(ApartioPermissions.AdminPermGroup, L("AdminPermGroup"));
        var myCustomerGroup = context.AddGroup(ApartioPermissions.CustomerPermGroup, L("CustomerPermGroup"));


        //Admin
        myAdminGroup.AddPermission(ApartioPermissions.Customer, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.Customer))));
        myAdminGroup.AddPermission(ApartioPermissions.CustomerAllPermission, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.CustomerAllPermission))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminPriceList, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminPriceList))));
        myAdminGroup.AddPermission(ApartioPermissions.UserAdmin, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.UserAdmin))));
        myAdminGroup.AddPermission(ApartioPermissions.WaitingTransferedOrders, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.WaitingTransferedOrders))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminOffers, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminOffers))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminExtracts, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminExtracts))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminFileManager, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminFileManager))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminComplaints, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminComplaints))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminLoadingRequest, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminLoadingRequest))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminPriceLists, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminPriceLists))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminPriceAggrements, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminPriceAggrements))));
        myAdminGroup.AddPermission(ApartioPermissions.CustomerVisit, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.CustomerVisit))));
        myAdminGroup.AddPermission(ApartioPermissions.CustomerVisitCreate, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.CustomerVisitCreate))));
        myAdminGroup.AddPermission(ApartioPermissions.AllCustomerVisit, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AllCustomerVisit))));
        myAdminGroup.AddPermission(ApartioPermissions.SalesPersonSeeCustomerPuanAndNotes, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.SalesPersonSeeCustomerPuanAndNotes))));
        myAdminGroup.AddPermission(ApartioPermissions.AimCreate, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AimCreate))));
        myAdminGroup.AddPermission(ApartioPermissions.AimList, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AimList))));
        myAdminGroup.AddPermission(ApartioPermissions.DispactImages, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.DispactImages))));
        myAdminGroup.AddPermission(ApartioPermissions.AdminCreateOrders, L(string.Join(":", nameof(ApartioPermissions.AdminPermGroup), nameof(ApartioPermissions.AdminCreateOrders))));
        


        //Müşteri
        myCustomerGroup.AddPermission(ApartioPermissions.Users, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.Users))));
        myCustomerGroup.AddPermission(ApartioPermissions.Orders, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.Orders))));
        myCustomerGroup.AddPermission(ApartioPermissions.CreateOrder, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.CreateOrder))));
        myCustomerGroup.AddPermission(ApartioPermissions.Dispacts, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.Dispacts))));
        myCustomerGroup.AddPermission(ApartioPermissions.Extracts, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.Extracts))));
        myCustomerGroup.AddPermission(ApartioPermissions.PriceList, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.PriceList))));
        myCustomerGroup.AddPermission(ApartioPermissions.CustomerOffers, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.CustomerOffers))));
        myCustomerGroup.AddPermission(ApartioPermissions.CustomerFileManager, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.CustomerFileManager))));
        myCustomerGroup.AddPermission(ApartioPermissions.CustomerComplaints, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.CustomerComplaints))));
        myCustomerGroup.AddPermission(ApartioPermissions.CustomerLoadingRequest, L(string.Join(":", nameof(ApartioPermissions.CustomerPermGroup), nameof(ApartioPermissions.CustomerLoadingRequest))));



    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<ApartioResource>(name);
    }
}
