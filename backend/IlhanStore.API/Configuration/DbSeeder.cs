using IlhanStore.DataAccess.Concrete.Context;
using IlhanStore.Entity.Entities;
using IlhanStore.Entity.Enums;
using Microsoft.EntityFrameworkCore;

namespace IlhanStore.API.Configuration;

public static class DbSeeder
{
    public static async Task SeedAsync(IlhanStoreContext context)
    {
        await EnsureAdminUserAsync(context);
        await EnsureUserCartsAsync(context);
    }

    private static async Task EnsureAdminUserAsync(IlhanStoreContext context)
    {
        if (await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
            return;

        var admin = new User
        {
            FirstName = "Admin",
            LastName = "IlhanStore",
            Email = "admin@ilhanstore.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            IsActive = true
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }

    private static async Task EnsureUserCartsAsync(IlhanStoreContext context)
    {
        var userIdsWithoutCart = await context.Users
            .Where(u => u.IsActive && !context.Carts.Any(c => c.UserId == u.Id))
            .Select(u => u.Id)
            .ToListAsync();

        foreach (var userId in userIdsWithoutCart)
        {
            context.Carts.Add(new Cart { UserId = userId });
        }

        if (userIdsWithoutCart.Count > 0)
            await context.SaveChangesAsync();
    }
}
