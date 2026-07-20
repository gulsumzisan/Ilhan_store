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
        var validParentIds = await ValidateAndFilterParentIds(dto.ParentCategoryIds, excludeId: null);
        if (validParentIds is null)
            return ApiResponse<CategoryDto>.Fail("Belirtilen üst kategorilerden biri bulunamadı.");

        var category = _mapper.Map<Entity.Entities.Category>(dto);
        await _categoryRepository.AddAsync(category);

        if (validParentIds.Count > 0)
            await _categoryRepository.SyncParentRelationshipsAsync(category.Id, validParentIds);

        var created = await _categoryRepository.GetWithRelationshipsAsync(category.Id);
        return ApiResponse<CategoryDto>.Ok(_mapper.Map<CategoryDto>(created!), "Kategori oluşturuldu.");
    }

    public async Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category is null)
            return ApiResponse<CategoryDto>.Fail("Kategori bulunamadı.");

        var validParentIds = await ValidateAndFilterParentIds(dto.ParentCategoryIds, excludeId: id);
        if (validParentIds is null)
            return ApiResponse<CategoryDto>.Fail("Belirtilen üst kategorilerden biri bulunamadı.");

        _mapper.Map(dto, category);
        category.UpdatedAt = DateTime.UtcNow;
        await _categoryRepository.UpdateAsync(category);
        await _categoryRepository.SyncParentRelationshipsAsync(id, validParentIds);

        var updated = await _categoryRepository.GetWithRelationshipsAsync(id);
        return ApiResponse<CategoryDto>.Ok(_mapper.Map<CategoryDto>(updated!), "Kategori güncellendi.");
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

    private async Task<List<int>?> ValidateAndFilterParentIds(List<int> parentIds, int? excludeId)
    {
        var filtered = parentIds
            .Where(pid => pid > 0 && pid != excludeId)
            .Distinct()
            .ToList();

        foreach (var pid in filtered)
        {
            var exists = await _categoryRepository.ExistsAsync(c => c.Id == pid && c.IsActive);
            if (!exists)
                return null;
        }

        return filtered;
    }
}
