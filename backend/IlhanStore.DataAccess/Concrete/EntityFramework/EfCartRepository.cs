using IlhanStore.DataAccess.Abstract;
using IlhanStore.DataAccess.Concrete.Context;
using IlhanStore.Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace IlhanStore.DataAccess.Concrete.EntityFramework;

public class EfCartRepository : EfGenericRepository<Cart>, ICartRepository
{
    public EfCartRepository(IlhanStoreContext context) : base(context)
    {
    }

    public async Task<Cart?> GetByUserIdAsync(int userId) =>
        await DbSet.FirstOrDefaultAsync(c => c.UserId == userId);

    public async Task<Cart?> GetWithItemsAsync(int userId) =>
        await DbSet
            .Include(c => c.CartItems.Where(ci => ci.IsActive))
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

    public async Task EnsureCartExistsForUserAsync(int userId)
    {
        if (await DbSet.AnyAsync(c => c.UserId == userId))
            return;

        await DbSet.AddAsync(new Cart { UserId = userId });
        await Context.SaveChangesAsync();
    }

    public async Task EnsureCartsForAllUsersAsync()
    {
        var userIdsWithoutCart = await Context.Users
            .Where(u => u.IsActive && !DbSet.Any(c => c.UserId == u.Id))
            .Select(u => u.Id)
            .ToListAsync();

        if (userIdsWithoutCart.Count == 0)
            return;

        foreach (var userId in userIdsWithoutCart)
        {
            await DbSet.AddAsync(new Cart { UserId = userId });
        }

        await Context.SaveChangesAsync();
    }

    public async Task<CartItem?> GetCartItemAsync(int cartId, int productId) =>
        await Context.CartItems
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId && ci.IsActive);

    public async Task AddCartItemAsync(CartItem item)
    {
        await Context.CartItems.AddAsync(item);
        await Context.SaveChangesAsync();
    }

    public async Task RemoveCartItemAsync(CartItem item)
    {
        Context.CartItems.Remove(item);
        await Context.SaveChangesAsync();
    }
}
