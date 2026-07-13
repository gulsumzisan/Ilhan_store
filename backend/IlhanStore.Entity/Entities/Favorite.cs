namespace IlhanStore.Entity.Entities;

public class Favorite : BaseEntity
{
    public int UserId { get; set; }
    public int ProductId { get; set; }

    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
