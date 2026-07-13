using System.Linq.Expressions;
using IlhanStore.DataAccess.Concrete.Context;
using Microsoft.EntityFrameworkCore;

namespace IlhanStore.DataAccess.Concrete.EntityFramework;

public class EfGenericRepository<T> : Abstract.IGenericRepository<T> where T : class
{
    protected readonly IlhanStoreContext Context;
    protected readonly DbSet<T> DbSet;

    public EfGenericRepository(IlhanStoreContext context)
    {
        Context = context;
        DbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id) =>
        await DbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync() =>
        await DbSet.ToListAsync();

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
        await DbSet.Where(predicate).ToListAsync();

    public async Task<T> AddAsync(T entity)
    {
        await DbSet.AddAsync(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        DbSet.Update(entity);
        await Context.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        DbSet.Remove(entity);
        await Context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) =>
        await DbSet.AnyAsync(predicate);
}
