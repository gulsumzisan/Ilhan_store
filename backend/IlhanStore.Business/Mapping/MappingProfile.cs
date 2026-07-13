using AutoMapper;
using IlhanStore.Business.DTOs.Auth;
using IlhanStore.Business.DTOs.Cart;
using IlhanStore.Business.DTOs.Category;
using IlhanStore.Business.DTOs.Order;
using IlhanStore.Business.DTOs.Product;
using IlhanStore.Business.DTOs.User;
using IlhanStore.Entity.Entities;

namespace IlhanStore.Business.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<RegisterDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();

        CreateMap<Category, CategoryDto>()
            .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products != null ? src.Products.Count : 0));
        CreateMap<CreateCategoryDto, Category>();
        CreateMap<UpdateCategoryDto, Category>();

        CreateMap<Cart, CartDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src =>
                src.CartItems.Sum(i => i.Quantity * (i.Product.DiscountPrice ?? i.Product.Price))));

        CreateMap<CartItem, CartItemDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.ProductImageUrl, opt => opt.MapFrom(src => src.Product.ImageUrl))
            .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.Product.DiscountPrice ?? src.Product.Price))
            .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src =>
                src.Quantity * (src.Product.DiscountPrice ?? src.Product.Price)));

        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems));
        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
    }
}
