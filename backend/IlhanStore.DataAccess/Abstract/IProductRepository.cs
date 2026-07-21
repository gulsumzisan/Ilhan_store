using IlhanStore.Entity.Entities;

namespace IlhanStore.DataAccess.Abstract;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId);
    Task<IEnumerable<Product>> SearchAsync(string? searchTerm, int? categoryId, decimal? minPrice, decimal? maxPrice);
    Task<Product?> GetWithDetailsAsync(int id);
    Task SyncCategoriesAsync(int productId, IEnumerable<int> categoryIds);
}
