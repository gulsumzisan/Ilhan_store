using IlhanStore.Business.DTOs.Common;
using IlhanStore.Business.DTOs.Product;

namespace IlhanStore.Business.Abstract;

public interface IProductService
{
    Task<ApiResponse<IEnumerable<ProductDto>>> GetAllAsync();
    Task<ApiResponse<ProductDto>> GetByIdAsync(int id);
    Task<ApiResponse<IEnumerable<ProductDto>>> SearchAsync(ProductSearchDto searchDto);
    Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto dto);
    Task<ApiResponse<ProductDto>> UpdateAsync(int id, UpdateProductDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
