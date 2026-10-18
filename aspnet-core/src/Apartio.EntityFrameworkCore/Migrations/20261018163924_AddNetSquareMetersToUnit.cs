using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apartio.Migrations
{
    /// <inheritdoc />
    public partial class AddNetSquareMetersToUnit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "NetSquareMeters",
                table: "AppUnits",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NetSquareMeters",
                table: "AppUnits");
        }
    }
}
