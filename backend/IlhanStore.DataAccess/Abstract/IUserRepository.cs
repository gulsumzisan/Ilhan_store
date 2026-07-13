using IlhanStore.Entity.Entities;

namespace IlhanStore.DataAccess.Abstract;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetWithDetailsAsync(int id);
}
