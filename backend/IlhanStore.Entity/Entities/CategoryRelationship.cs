namespace IlhanStore.Entity.Entities;

public class CategoryRelationship
{
    public int ParentCategoryId { get; set; }
    public int ChildCategoryId { get; set; }

    public Category ParentCategory { get; set; } = null!;
    public Category ChildCategory { get; set; } = null!;
}
