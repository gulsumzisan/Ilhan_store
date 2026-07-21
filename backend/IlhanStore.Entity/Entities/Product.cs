using IlhanStore.Entity.Enums;

namespace IlhanStore.Entity.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Brand { get; set; }
    public string? Color { get; set; }
    public ClothingSize Size { get; set; }
    /// <summary>Virgülle ayrılmış beden değerleri — örn. "0,1,3" (XS,S,L)</summary>
    public string? Sizes { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageUrls { get; set; }
    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;
    public ICollection<ProductCategory> ProductCategories { get; set; } = [];
    public ICollection<CartItem> CartItems { get; set; } = [];
    public ICollection<OrderItem> OrderItems { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
    public ICollection<Favorite> Favorites { get; set; } = [];
}
