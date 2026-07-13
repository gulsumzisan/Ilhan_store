using IlhanStore.DataAccess.Abstract;
using IlhanStore.DataAccess.Concrete.Context;
using IlhanStore.Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace IlhanStore.DataAccess.Concrete.EntityFramework;

public class EfOrderRepository : EfGenericRepository<Order>, IOrderRepository
{
    public EfOrderRepository(IlhanStoreContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId) =>
        await DbSet
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

    public async Task<Order?> GetWithItemsAsync(int id) =>
        await DbSet
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<IEnumerable<Order>> GetAllWithDetailsAsync() =>
        await DbSet
            .Include(o => o.OrderItems)
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
}
