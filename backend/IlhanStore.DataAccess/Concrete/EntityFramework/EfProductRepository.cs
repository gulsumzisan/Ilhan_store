using IlhanStore.DataAccess.Abstract;
using IlhanStore.DataAccess.Concrete.Context;
using IlhanStore.Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace IlhanStore.DataAccess.Concrete.EntityFramework;

public class EfProductRepository : EfGenericRepository<Product>, IProductRepository
{
    public EfProductRepository(IlhanStoreContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId) =>
        await DbSet
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId && p.IsActive)
            .ToListAsync();

    public async Task<IEnumerable<Product>> SearchAsync(string? searchTerm, int? categoryId, decimal? minPrice, decimal? maxPrice)
    {
        var query = DbSet.Include(p => p.Category).Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p =>
                p.Name.Contains(searchTerm) ||
                p.Description.Contains(searchTerm) ||
                (p.Brand != null && p.Brand.Contains(searchTerm)));
        }

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        return await query.ToListAsync();
    }

    public async Task<Product?> GetWithDetailsAsync(int id) =>
        await DbSet
            .Include(p => p.Category)
            .Include(p => p.ProductCategories)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task SyncCategoriesAsync(int productId, IEnumerable<int> categoryIds)
    {
        var existing = await Context.ProductCategories
            .Where(pc => pc.ProductId == productId)
            .ToListAsync();

        Context.ProductCategories.RemoveRange(existing);

        foreach (var categoryId in categoryIds.Distinct())
        {
            Context.ProductCategories.Add(new ProductCategory
            {
                ProductId = productId,
                CategoryId = categoryId
            });
        }

        await Context.SaveChangesAsync();
    }
}
