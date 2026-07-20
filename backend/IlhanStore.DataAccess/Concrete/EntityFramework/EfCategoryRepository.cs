using IlhanStore.DataAccess.Abstract;
using IlhanStore.DataAccess.Concrete.Context;
using IlhanStore.Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace IlhanStore.DataAccess.Concrete.EntityFramework;

public class EfCategoryRepository : EfGenericRepository<Category>, ICategoryRepository
{
    public EfCategoryRepository(IlhanStoreContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetAllWithProductsAsync() =>
        await DbSet
            .Include(c => c.Products.Where(p => p.IsActive))
            .Include(c => c.ParentRelationships)
            .Where(c => c.IsActive)
            .ToListAsync();

    public async Task<Category?> GetWithProductsAsync(int id) =>
        await DbSet
            .Include(c => c.Products.Where(p => p.IsActive))
            .Include(c => c.ParentRelationships)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<Category?> GetWithRelationshipsAsync(int id) =>
        await DbSet
            .Include(c => c.Products.Where(p => p.IsActive))
            .Include(c => c.ParentRelationships)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task SyncParentRelationshipsAsync(int categoryId, IEnumerable<int> parentIds)
    {
        var existing = await Context.CategoryRelationships
            .Where(r => r.ChildCategoryId == categoryId)
            .ToListAsync();

        Context.CategoryRelationships.RemoveRange(existing);

        foreach (var parentId in parentIds.Distinct())
        {
            Context.CategoryRelationships.Add(new CategoryRelationship
            {
                ParentCategoryId = parentId,
                ChildCategoryId = categoryId
            });
        }

        await Context.SaveChangesAsync();
    }
}
