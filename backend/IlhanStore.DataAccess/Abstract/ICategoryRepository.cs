using IlhanStore.Entity.Entities;

namespace IlhanStore.DataAccess.Abstract;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<IEnumerable<Category>> GetAllWithProductsAsync();
    Task<Category?> GetWithProductsAsync(int id);
}
