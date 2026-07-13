using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IlhanStore.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class BackfillUserCarts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO Carts (UserId, CreatedAt, IsActive)
                SELECT u.Id, GETUTCDATE(), 1
                FROM Users u
                WHERE u.IsActive = 1
                  AND NOT EXISTS (SELECT 1 FROM Carts c WHERE c.UserId = u.Id);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE c
                FROM Carts c
                INNER JOIN Users u ON u.Id = c.UserId
                WHERE NOT EXISTS (SELECT 1 FROM CartItems ci WHERE ci.CartId = c.Id);
                """);
        }
    }
}
