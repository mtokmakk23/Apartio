using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apartio.Migrations;

/// <inheritdoc />
public partial class addedAssetsTable : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "AppAssets",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                HousingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                LocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                LocationType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                LocationDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                Location = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                PurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                Supplier = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                WarrantyEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AppAssets", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "AppAssetMaintenanceLogs",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                AssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                MaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                PerformedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AppAssetMaintenanceLogs", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_AppAssets_HousingId_Code",
            table: "AppAssets",
            columns: new[] { "HousingId", "Code" });

        migrationBuilder.CreateIndex(
            name: "IX_AppAssets_LocationId",
            table: "AppAssets",
            column: "LocationId");

        migrationBuilder.CreateIndex(
            name: "IX_AppAssetMaintenanceLogs_AssetId",
            table: "AppAssetMaintenanceLogs",
            column: "AssetId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "AppAssetMaintenanceLogs");
        migrationBuilder.DropTable(name: "AppAssets");
    }
}
