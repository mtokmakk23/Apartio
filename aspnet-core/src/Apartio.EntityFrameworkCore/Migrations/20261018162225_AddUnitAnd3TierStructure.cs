using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apartio.Migrations
{
    /// <inheritdoc />
    public partial class AddUnitAnd3TierStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CircleId",
                table: "AppDuesTransactions",
                newName: "UnitId");

            migrationBuilder.AddColumn<Guid>(
                name: "BlockId",
                table: "AppUserMatchHousings",
                type: "uniqueidentifier",
                nullable: true);


            migrationBuilder.CreateTable(
                name: "AppUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    BlockId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UnitNumber = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    UnitType = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Floor = table.Column<int>(type: "int", nullable: false),
                    GrossSquareMeters = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    HomeOwnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    HirerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUnits", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AppHousingTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Rezidans");

            migrationBuilder.UpdateData(
                table: "AppHousingTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "Name",
                value: "Villa Sitesi");

            migrationBuilder.UpdateData(
                table: "AppHousingTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Müstakil Ev");

            migrationBuilder.InsertData(
                table: "AppHousingTypes",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[] { 6, null, "İş Merkezi / Plaza" });


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.DropTable(
                name: "AppUnits");

            migrationBuilder.DeleteData(
                table: "AppHousingTypes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DropColumn(
                name: "BlockId",
                table: "AppUserMatchHousings");

            migrationBuilder.RenameColumn(
                name: "UnitId",
                table: "AppDuesTransactions",
                newName: "CircleId");

            migrationBuilder.UpdateData(
                table: "AppHousingTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Daire");

            migrationBuilder.UpdateData(
                table: "AppHousingTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "Name",
                value: "Rezidans");

            migrationBuilder.UpdateData(
                table: "AppHousingTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Villa");
        }
    }
}
