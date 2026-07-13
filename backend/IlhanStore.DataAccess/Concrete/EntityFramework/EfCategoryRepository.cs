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
            .Where(c => c.IsActive)
            .ToListAsync();

    public async Task<Category?> GetWithProductsAsync(int id) =>
        await DbSet
            .Include(c => c.Products.Where(p => p.IsActive))
            .FirstOrDefaultAsync(c => c.Id == id);
}
