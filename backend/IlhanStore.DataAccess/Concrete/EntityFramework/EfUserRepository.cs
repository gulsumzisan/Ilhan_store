using IlhanStore.DataAccess.Abstract;
using IlhanStore.DataAccess.Concrete.Context;
using IlhanStore.Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace IlhanStore.DataAccess.Concrete.EntityFramework;

public class EfUserRepository : EfGenericRepository<User>, IUserRepository
{
    public EfUserRepository(IlhanStoreContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email) =>
        await DbSet.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User?> GetWithDetailsAsync(int id) =>
        await DbSet
            .Include(u => u.Addresses)
            .Include(u => u.Orders)
            .FirstOrDefaultAsync(u => u.Id == id);
}
