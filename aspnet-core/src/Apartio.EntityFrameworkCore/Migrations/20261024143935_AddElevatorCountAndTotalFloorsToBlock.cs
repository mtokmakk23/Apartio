using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apartio.Migrations;

/// <inheritdoc />
public partial class AddElevatorCountAndTotalFloorsToBlock : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<byte>(
            name: "ElevatorCount",
            table: "AppBlocks",
            type: "tinyint",
            nullable: false,
            defaultValue: (byte)0);

        migrationBuilder.AddColumn<byte>(
            name: "TotalFloors",
            table: "AppBlocks",
            type: "tinyint",
            nullable: false,
            defaultValue: (byte)1);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "ElevatorCount",
            table: "AppBlocks");

        migrationBuilder.DropColumn(
            name: "TotalFloors",
            table: "AppBlocks");
    }
}
