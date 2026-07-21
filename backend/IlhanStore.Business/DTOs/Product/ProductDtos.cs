using IlhanStore.Entity.Enums;

namespace IlhanStore.Business.DTOs.Product;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Brand { get; set; }
    public string? Color { get; set; }
    public ClothingSize Size { get; set; }
    /// <summary>Virgülle ayrılmış beden değerleri — örn. "0,1,3"</summary>
    public string? Sizes { get; set; }
    public string? ImageUrl { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public List<int> CategoryIds { get; set; } = [];
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Brand { get; set; }
    public string? Color { get; set; }
    public ClothingSize Size { get; set; }
    /// <summary>Virgülle ayrılmış beden değerleri — örn. "0,1,3"</summary>
    public string? Sizes { get; set; }
    public string? ImageUrl { get; set; }
    public List<int> CategoryIds { get; set; } = [];
}

public class UpdateProductDto : CreateProductDto
{
}

public class ProductSearchDto
{
    public string? SearchTerm { get; set; }
    public int? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
