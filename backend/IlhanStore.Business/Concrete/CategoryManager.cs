using AutoMapper;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.DTOs.Category;
using IlhanStore.Business.DTOs.Common;
using IlhanStore.DataAccess.Abstract;

namespace IlhanStore.Business.Concrete;

public class CategoryManager : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoryManager(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllWithProductsAsync();
        return ApiResponse<IEnumerable<CategoryDto>>.Ok(_mapper.Map<IEnumerable<CategoryDto>>(categories));
    }

    public async Task<ApiResponse<CategoryDto>> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetWithProductsAsync(id);
        if (category is null || !category.IsActive)
            return ApiResponse<CategoryDto>.Fail("Kategori bulunamadı.");

        return ApiResponse<CategoryDto>.Ok(_mapper.Map<CategoryDto>(category));
    }

    public async Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto)
    {
        dto.ParentCategoryId = NormalizeParentCategoryId(dto.ParentCategoryId);

        if (dto.ParentCategoryId.HasValue)
        {
            var parentExists = await _categoryRepository.ExistsAsync(c =>
                c.Id == dto.ParentCategoryId.Value && c.IsActive);
            if (!parentExists)
                return ApiResponse<CategoryDto>.Fail("Üst kategori bulunamadı.");
        }

        var category = _mapper.Map<Entity.Entities.Category>(dto);
        await _categoryRepository.AddAsync(category);
        return ApiResponse<CategoryDto>.Ok(_mapper.Map<CategoryDto>(category), "Kategori oluşturuldu.");
    }

    public async Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category is null)
            return ApiResponse<CategoryDto>.Fail("Kategori bulunamadı.");

        dto.ParentCategoryId = NormalizeParentCategoryId(dto.ParentCategoryId);

        if (dto.ParentCategoryId.HasValue)
        {
            if (dto.ParentCategoryId.Value == id)
                return ApiResponse<CategoryDto>.Fail("Kategori kendi üst kategorisi olamaz.");

            var parentExists = await _categoryRepository.ExistsAsync(c =>
                c.Id == dto.ParentCategoryId.Value && c.IsActive);
            if (!parentExists)
                return ApiResponse<CategoryDto>.Fail("Üst kategori bulunamadı.");
        }

        _mapper.Map(dto, category);
        category.UpdatedAt = DateTime.UtcNow;
        await _categoryRepository.UpdateAsync(category);

        return ApiResponse<CategoryDto>.Ok(_mapper.Map<CategoryDto>(category), "Kategori güncellendi.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category is null)
            return ApiResponse<bool>.Fail("Kategori bulunamadı.");

        category.IsActive = false;
        category.UpdatedAt = DateTime.UtcNow;
        await _categoryRepository.UpdateAsync(category);

        return ApiResponse<bool>.Ok(true, "Kategori silindi.");
    }

    private static int? NormalizeParentCategoryId(int? parentCategoryId) =>
        parentCategoryId is null or <= 0 ? null : parentCategoryId;
}
