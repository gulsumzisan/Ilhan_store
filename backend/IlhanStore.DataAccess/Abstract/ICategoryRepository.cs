using IlhanStore.Entity.Entities;

namespace IlhanStore.DataAccess.Abstract;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<IEnumerable<Category>> GetAllWithProductsAsync();
    Task<Category?> GetWithProductsAsync(int id);
    Task<Category?> GetWithRelationshipsAsync(int id);
    Task SyncParentRelationshipsAsync(int categoryId, IEnumerable<int> parentIds);
}
