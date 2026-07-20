namespace IlhanStore.Entity.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsMainCategory { get; set; } = true;

    // Relationships where this category is the PARENT (its child subcategories)
    public ICollection<CategoryRelationship> ChildRelationships { get; set; } = [];
    // Relationships where this category is the CHILD (its parent categories)
    public ICollection<CategoryRelationship> ParentRelationships { get; set; } = [];
    public ICollection<Product> Products { get; set; } = [];
}
