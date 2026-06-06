namespace Apartio.Permissions;

public static class ApartioPermissions
{
    public const string AdminPermGroup = "AdminPermGroup";
    public const string CustomerPermGroup = "CustomerPermGroup";

    //Admin
    public const string Customer = AdminPermGroup + ".Customer";
    public const string CustomerAllPermission = AdminPermGroup + ".CustomerAllPermission";
    public const string AdminPriceList = AdminPermGroup + ".AdminPriceList";
    public const string UserAdmin = AdminPermGroup + ".UserAdmin";
    public const string WaitingTransferedOrders = AdminPermGroup + ".WaitingTransferedOrders";
    public const string AdminOffers = AdminPermGroup + ".AdminOffers";
    public const string AdminExtracts = AdminPermGroup + ".AdminExtracts";
    public const string AdminFileManager = AdminPermGroup + ".AdminFileManager";
    public const string AdminComplaints = AdminPermGroup + ".AdminComplaints";
    public const string AdminLoadingRequest = AdminPermGroup + ".AdminLoadingRequest";
    public const string AdminPriceLists = AdminPermGroup + ".AdminPriceLists";
    public const string AdminPriceAggrements = AdminPermGroup + ".AdminPriceAggrements";
    public const string CustomerVisit = AdminPermGroup + ".CustomerVisit";
    public const string CustomerVisitCreate = AdminPermGroup + ".CustomerVisitCreate";
    public const string AllCustomerVisit = AdminPermGroup + ".AllCustomerVisit";
    public const string SalesPersonSeeCustomerPuanAndNotes = AdminPermGroup + ".SalesPersonSeeCustomerPuanAndNotes";
    public const string AimCreate = AdminPermGroup + ".AimCreate";
    public const string AimList = AdminPermGroup + ".AimList";
    public const string DispactImages = AdminPermGroup + ".DispactImages";
    public const string AdminCreateOrders = AdminPermGroup + ".AdminCreateOrders";


    //Müşteri
    public const string Users = CustomerPermGroup + ".Users";
    public const string Orders = CustomerPermGroup + ".Orders";
    public const string CreateOrder = CustomerPermGroup + ".CreateOrder";
    public const string Dispacts = CustomerPermGroup + ".Dispacts";
    public const string Extracts = CustomerPermGroup + ".Extracts";
    public const string PriceList = CustomerPermGroup + ".PriceList";
    public const string CustomerOffers = CustomerPermGroup + ".CustomerOffers";
    public const string CustomerFileManager = CustomerPermGroup + ".CustomerFileManager";
    public const string CustomerComplaints = CustomerPermGroup + ".CustomerComplaints";
    public const string CustomerLoadingRequest = CustomerPermGroup + ".CustomerLoadingRequest";


}
