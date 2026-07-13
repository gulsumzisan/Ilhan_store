using IlhanStore.Entity.Entities;

namespace IlhanStore.DataAccess.Abstract;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<IEnumerable<Order>> GetByUserIdAsync(int userId);
    Task<Order?> GetWithItemsAsync(int id);
    Task<IEnumerable<Order>> GetAllWithDetailsAsync();
}
