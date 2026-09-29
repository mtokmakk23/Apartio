using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apartio.Migrations
{
    /// <inheritdoc />
    public partial class ChangeHousingTypeToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE [AppHousings]
                SET [Type] = CASE 
                    WHEN LOWER(LTRIM(RTRIM([Type]))) = 'site' THEN '1'
                    WHEN LOWER(LTRIM(RTRIM([Type]))) = 'apartman' THEN '2'
                    WHEN LOWER(LTRIM(RTRIM([Type]))) = 'daire' THEN '3'
                    WHEN LOWER(LTRIM(RTRIM([Type]))) = 'rezidans' THEN '4'
                    WHEN LOWER(LTRIM(RTRIM([Type]))) = 'villa' THEN '5'
                    ELSE '2'
                END
                WHERE [Type] IS NULL OR TRY_CAST([Type] AS int) IS NULL;
            ");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "AppHousings",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<byte>(
                name: "Status",
                table: "AppExpenses",
                type: "tinyint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "AppHousings",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.Sql(@"
                UPDATE [AppHousings]
                SET [Type] = CASE [Type]
                    WHEN '1' THEN 'Site'
                    WHEN '2' THEN 'Apartman'
                    WHEN '3' THEN 'Daire'
                    WHEN '4' THEN 'Rezidans'
                    WHEN '5' THEN 'Villa'
                    ELSE 'Apartman'
                END;
            ");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "AppExpenses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(byte),
                oldType: "tinyint");
        }
    }
}
