using FluentValidation;
using FluentValidation.AspNetCore;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.Configuration;
using IlhanStore.Business.Concrete;
using IlhanStore.Business.Mapping;
using IlhanStore.Business.Validation;
using IlhanStore.DataAccess.Abstract;
using IlhanStore.DataAccess.Concrete.EntityFramework;
using Microsoft.Extensions.DependencyInjection;

namespace IlhanStore.Business.DependencyResolvers;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBusinessServices(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));

        services.AddScoped<IAuthService, AuthManager>();
        services.AddScoped<IProductService, ProductManager>();
        services.AddScoped<ICategoryService, CategoryManager>();
        services.AddScoped<IUserService, UserManager>();
        services.AddScoped<ICartService, CartManager>();
        services.AddScoped<IOrderService, OrderManager>();
        services.AddScoped<ITokenService, TokenService>();

        services.AddScoped<IProductRepository, EfProductRepository>();
        services.AddScoped<ICategoryRepository, EfCategoryRepository>();
        services.AddScoped<IUserRepository, EfUserRepository>();
        services.AddScoped<ICartRepository, EfCartRepository>();
        services.AddScoped<IOrderRepository, EfOrderRepository>();

        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();

        return services;
    }
}
