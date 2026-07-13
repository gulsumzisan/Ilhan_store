using IlhanStore.Business.DTOs.Category;
using IlhanStore.Business.DTOs.Common;

namespace IlhanStore.Business.Abstract;

public interface ICategoryService
{
    Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllAsync();
    Task<ApiResponse<CategoryDto>> GetByIdAsync(int id);
    Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto);
    Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
