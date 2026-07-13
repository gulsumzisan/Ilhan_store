using AutoMapper;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.DTOs.Common;
using IlhanStore.Business.DTOs.Product;
using IlhanStore.DataAccess.Abstract;

namespace IlhanStore.Business.Concrete;

public class ProductManager : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public ProductManager(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<IEnumerable<ProductDto>>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return ApiResponse<IEnumerable<ProductDto>>.Ok(
            _mapper.Map<IEnumerable<ProductDto>>(products.Where(p => p.IsActive)));
    }

    public async Task<ApiResponse<ProductDto>> GetByIdAsync(int id)
    {
        var product = await _productRepository.GetWithDetailsAsync(id);
        if (product is null || !product.IsActive)
            return ApiResponse<ProductDto>.Fail("Ürün bulunamadı.");

        return ApiResponse<ProductDto>.Ok(_mapper.Map<ProductDto>(product));
    }

    public async Task<ApiResponse<IEnumerable<ProductDto>>> SearchAsync(ProductSearchDto searchDto)
    {
        var products = await _productRepository.SearchAsync(
            searchDto.SearchTerm, searchDto.CategoryId, searchDto.MinPrice, searchDto.MaxPrice);

        return ApiResponse<IEnumerable<ProductDto>>.Ok(_mapper.Map<IEnumerable<ProductDto>>(products));
    }

    public async Task<ApiResponse<ProductDto>> CreateAsync(CreateProductDto dto)
    {
        if (!await _categoryRepository.ExistsAsync(c => c.Id == dto.CategoryId))
            return ApiResponse<ProductDto>.Fail("Kategori bulunamadı.");

        var product = _mapper.Map<Entity.Entities.Product>(dto);
        await _productRepository.AddAsync(product);

        var created = await _productRepository.GetWithDetailsAsync(product.Id);
        return ApiResponse<ProductDto>.Ok(_mapper.Map<ProductDto>(created!), "Ürün oluşturuldu.");
    }

    public async Task<ApiResponse<ProductDto>> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product is null)
            return ApiResponse<ProductDto>.Fail("Ürün bulunamadı.");

        _mapper.Map(dto, product);
        product.UpdatedAt = DateTime.UtcNow;
        await _productRepository.UpdateAsync(product);

        var updated = await _productRepository.GetWithDetailsAsync(id);
        return ApiResponse<ProductDto>.Ok(_mapper.Map<ProductDto>(updated!), "Ürün güncellendi.");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product is null)
            return ApiResponse<bool>.Fail("Ürün bulunamadı.");

        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        await _productRepository.UpdateAsync(product);

        return ApiResponse<bool>.Ok(true, "Ürün silindi.");
    }
}
