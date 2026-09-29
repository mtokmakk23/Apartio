using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Apartio.Migrations
{
    /// <inheritdoc />
    public partial class AddedHousingTypeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppHousingTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppHousingTypes", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "AppHousingTypes",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, null, "Site" },
                    { 2, null, "Apartman" },
                    { 3, null, "Daire" },
                    { 4, null, "Rezidans" },
                    { 5, null, "Villa" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppHousings_Type",
                table: "AppHousings",
                column: "Type");

            migrationBuilder.AddForeignKey(
                name: "FK_AppHousings_AppHousingTypes_Type",
                table: "AppHousings",
                column: "Type",
                principalTable: "AppHousingTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppHousings_AppHousingTypes_Type",
                table: "AppHousings");

            migrationBuilder.DropTable(
                name: "AppHousingTypes");

            migrationBuilder.DropIndex(
                name: "IX_AppHousings_Type",
                table: "AppHousings");
        }
    }
}
