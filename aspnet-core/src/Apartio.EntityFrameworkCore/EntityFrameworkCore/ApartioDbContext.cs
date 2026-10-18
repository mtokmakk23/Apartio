using Apartio.Assets;
using Apartio.DuesTransactions;
using Apartio.Expenses;
using Apartio.FloorResidents;
using Apartio.Housings;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace Apartio.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class ApartioDbContext :
	AbpDbContext<ApartioDbContext>,
	IIdentityDbContext,
	ITenantManagementDbContext
{

	/* Add DbSet properties for your Aggregate Roots / Entities here. */
	public DbSet<Housing> Housings { get; set; }
	public DbSet<HousingType> HousingTypes { get; set; }
	public DbSet<UserMatchHousing> UserMatchHousings { get; set; }
	public DbSet<Block> Blocks { get; set; }
	public DbSet<Circle> Circles { get; set; }
	public DbSet<Unit> Units { get; set; }
	public DbSet<FloorResident> FloorResidents { get; set; }
	public DbSet<DuesTransaction> DuesTransactions { get; set; }
	public DbSet<Expense> Expenses { get; set; }
	public DbSet<Asset> Assets { get; set; }
	public DbSet<AssetMaintenanceLog> AssetMaintenanceLogs { get; set; }


	#region Entities from the modules

	/* Notice: We only implemented IIdentityDbContext and ITenantManagementDbContext
	 * and replaced them for this DbContext. This allows you to perform JOIN
	 * queries for the entities of these modules over the repositories easily. You
	 * typically don't need that for other modules. But, if you need, you can
	 * implement the DbContext interface of the needed module and use ReplaceDbContext
	 * attribute just like IIdentityDbContext and ITenantManagementDbContext.
	 *
	 * More info: Replacing a DbContext of a module ensures that the related module
	 * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
	 */

	//Identity
	public DbSet<IdentityUser> Users { get; set; }
	public DbSet<IdentityRole> Roles { get; set; }
	public DbSet<IdentityClaimType> ClaimTypes { get; set; }
	public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
	public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
	public DbSet<IdentityLinkUser> LinkUsers { get; set; }
	public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
	public DbSet<IdentitySession> Sessions { get; set; }
	// Tenant Management
	public DbSet<Tenant> Tenants { get; set; }
	public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

	#endregion

	public ApartioDbContext(DbContextOptions<ApartioDbContext> options)
		: base(options)
	{
	}

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);

		foreach (var property in builder.Model
		.GetEntityTypes()
		.SelectMany(t => t.GetProperties())
		.Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
		{
			property.SetColumnType("decimal(18,10)");
		}
		/* Include modules to your migration db context */

		builder.ConfigurePermissionManagement();
		builder.ConfigureSettingManagement();
		builder.ConfigureBackgroundJobs();
		builder.ConfigureAuditLogging();
		builder.ConfigureIdentity();
		builder.ConfigureOpenIddict();
		builder.ConfigureFeatureManagement();
		builder.ConfigureTenantManagement();

		/* Configure your own tables/entities inside here */

		builder.Entity<HousingType>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "HousingTypes"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
			typeBuilder.Property(x => x.Id).ValueGeneratedNever();
			typeBuilder.Property(x => x.Name).IsRequired().HasMaxLength(64);
			typeBuilder.HasData(
				new HousingType(1, "Site"),
				new HousingType(2, "Apartman"),
				new HousingType(3, "Rezidans"),
				new HousingType(4, "Villa Sitesi"),
				new HousingType(5, "Müstakil Ev"),
				new HousingType(6, "İş Merkezi / Plaza")
			);
		});

		builder.Entity<Housing>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "Housings"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
			typeBuilder.HasOne(x => x.HousingType)
				.WithMany()
				.HasForeignKey(x => x.Type)
				.OnDelete(DeleteBehavior.Restrict);
		});
		builder.Entity<UserMatchHousing>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "UserMatchHousings"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
		});
		builder.Entity<Block>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "Blocks"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
		});
		builder.Entity<Circle>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "Circles"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
		});
		builder.Entity<Unit>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "Units"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
			typeBuilder.Property(x => x.UnitNumber).IsRequired().HasMaxLength(64);
			typeBuilder.Property(x => x.UnitType).IsRequired().HasMaxLength(64);
			typeBuilder.Property(x => x.GrossSquareMeters).HasColumnType("decimal(6,2)");
			typeBuilder.Property(x => x.NetSquareMeters).HasColumnType("decimal(6,2)");
		});
		builder.Entity<FloorResident>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "FloorResidents"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
		});
		builder.Entity<DuesTransaction>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "DuesTransactions"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();
		});
		builder.Entity<Expense>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "Expenses"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();

			typeBuilder.Property(x => x.Amount).HasColumnType("decimal(18,2)");
			typeBuilder.Property(x => x.PaidAmount).HasColumnType("decimal(18,2)");
		});

		builder.Entity<Asset>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "Assets"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();

			typeBuilder.Property(x => x.Name).HasMaxLength(255);
			typeBuilder.Property(x => x.Code).HasMaxLength(100);
			typeBuilder.Property(x => x.Category).HasMaxLength(100);
			typeBuilder.Property(x => x.Location).HasMaxLength(200);
			typeBuilder.Property(x => x.Status).HasMaxLength(50);
			typeBuilder.Property(x => x.Supplier).HasMaxLength(255);

			// Not: DB tarafında unique constraint konulmamıştır. Teklik kontrolü Backend Business Rules seviyesinde yürütülür.
			typeBuilder.HasIndex(x => new { x.HousingId, x.Code });
		});

		builder.Entity<AssetMaintenanceLog>(typeBuilder =>
		{
			typeBuilder.ToTable(string.Concat(ApartioConsts.DbTablePrefix, "AssetMaintenanceLogs"), ApartioConsts.DbSchema);
			typeBuilder.ConfigureByConvention();

			typeBuilder.Property(x => x.Description).IsRequired().HasMaxLength(1000);
			typeBuilder.Property(x => x.Cost).HasColumnType("decimal(18,2)");
			typeBuilder.Property(x => x.PerformedBy).HasMaxLength(255);

			typeBuilder.HasIndex(x => x.AssetId);
		});
	}
}
