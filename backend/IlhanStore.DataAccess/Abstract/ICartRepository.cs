using IlhanStore.Entity.Entities;

namespace IlhanStore.DataAccess.Abstract;

public interface ICartRepository : IGenericRepository<Cart>
{
    Task<Cart?> GetByUserIdAsync(int userId);
    Task<Cart?> GetWithItemsAsync(int userId);
    Task EnsureCartExistsForUserAsync(int userId);
    Task EnsureCartsForAllUsersAsync();
    Task<CartItem?> GetCartItemAsync(int cartId, int productId);
    Task AddCartItemAsync(CartItem item);
    Task RemoveCartItemAsync(CartItem item);
}
