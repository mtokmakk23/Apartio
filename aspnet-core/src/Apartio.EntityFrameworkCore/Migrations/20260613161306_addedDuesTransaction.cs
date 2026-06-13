using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apartio.Migrations
{
    /// <inheritdoc />
    public partial class addedDuesTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LastPaymentDay",
                table: "AppHousings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AppDuesTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    HousingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlockId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CircleId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FloorResidentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,10)", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Date_ = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DelayCompensationRate = table.Column<decimal>(type: "decimal(18,10)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sing = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDuesTransactions", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppDuesTransactions");

            migrationBuilder.DropColumn(
                name: "LastPaymentDay",
                table: "AppHousings");
        }
    }
}
