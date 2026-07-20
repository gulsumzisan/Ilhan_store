using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IlhanStore.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CategoryManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Add IsMainCategory with default true (all existing are treated as main)
            migrationBuilder.AddColumn<bool>(
                name: "IsMainCategory",
                table: "Categories",
                type: "bit",
                nullable: false,
                defaultValue: true);

            // 2. Create the new many-to-many join table BEFORE dropping the old column
            migrationBuilder.CreateTable(
                name: "CategoryRelationships",
                columns: table => new
                {
                    ParentCategoryId = table.Column<int>(type: "int", nullable: false),
                    ChildCategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryRelationships", x => new { x.ParentCategoryId, x.ChildCategoryId });
                    table.ForeignKey(
                        name: "FK_CategoryRelationships_Categories_ChildCategoryId",
                        column: x => x.ChildCategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CategoryRelationships_Categories_ParentCategoryId",
                        column: x => x.ParentCategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryRelationships_ChildCategoryId",
                table: "CategoryRelationships",
                column: "ChildCategoryId");

            // 3. Migrate existing parent-child data before dropping the old column
            migrationBuilder.Sql(
                "INSERT INTO CategoryRelationships (ParentCategoryId, ChildCategoryId) " +
                "SELECT ParentCategoryId, Id FROM Categories WHERE ParentCategoryId IS NOT NULL AND IsActive = 1");

            // 4. Categories that had a parent are not main categories by default
            migrationBuilder.Sql(
                "UPDATE Categories SET IsMainCategory = 0 WHERE ParentCategoryId IS NOT NULL");

            // 5. Now safely remove the old column
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "ParentCategoryId",
                table: "Categories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryRelationships");

            migrationBuilder.DropColumn(
                name: "IsMainCategory",
                table: "Categories");

            migrationBuilder.AddColumn<int>(
                name: "ParentCategoryId",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentCategoryId",
                table: "Categories",
                column: "ParentCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentCategoryId",
                table: "Categories",
                column: "ParentCategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
