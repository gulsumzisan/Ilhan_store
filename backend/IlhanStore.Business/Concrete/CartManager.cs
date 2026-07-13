using AutoMapper;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.DTOs.Cart;
using IlhanStore.Business.DTOs.Common;
using IlhanStore.DataAccess.Abstract;
using IlhanStore.Entity.Entities;

namespace IlhanStore.Business.Concrete;

public class CartManager : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public CartManager(
        ICartRepository cartRepository,
        IProductRepository productRepository,
        IMapper mapper)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<CartDto>> GetCartAsync(int userId)
    {
        await _cartRepository.EnsureCartExistsForUserAsync(userId);
        var cart = await _cartRepository.GetWithItemsAsync(userId);
        return ApiResponse<CartDto>.Ok(_mapper.Map<CartDto>(cart!));
    }

    public async Task<ApiResponse<CartDto>> AddItemAsync(int userId, AddToCartDto dto)
    {
        if (dto.Quantity <= 0)
            return ApiResponse<CartDto>.Fail("Miktar 0'dan büyük olmalıdır.");

        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product is null || !product.IsActive)
            return ApiResponse<CartDto>.Fail("Ürün bulunamadı.");

        await _cartRepository.EnsureCartExistsForUserAsync(userId);
        var cart = await _cartRepository.GetWithItemsAsync(userId);
        if (cart is null)
            return ApiResponse<CartDto>.Fail("Sepet bulunamadı.");

        var existingItem = await _cartRepository.GetCartItemAsync(cart.Id, dto.ProductId);
        var requestedQuantity = existingItem is null ? dto.Quantity : existingItem.Quantity + dto.Quantity;

        if (product.StockQuantity < requestedQuantity)
            return ApiResponse<CartDto>.Fail("Yetersiz stok.");

        if (existingItem is not null)
        {
            existingItem.Quantity = requestedQuantity;
            existingItem.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.UpdateAsync(cart);
        }
        else
        {
            await _cartRepository.AddCartItemAsync(new CartItem
            {
                CartId = cart.Id,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            });
        }

        var updatedCart = await _cartRepository.GetWithItemsAsync(userId);
        return ApiResponse<CartDto>.Ok(_mapper.Map<CartDto>(updatedCart!), "Ürün sepete eklendi.");
    }

    public async Task<ApiResponse<CartDto>> UpdateItemAsync(int userId, int itemId, UpdateCartItemDto dto)
    {
        if (dto.Quantity <= 0)
            return ApiResponse<CartDto>.Fail("Miktar 0'dan büyük olmalıdır.");

        var cart = await _cartRepository.GetWithItemsAsync(userId);
        if (cart is null)
            return ApiResponse<CartDto>.Fail("Sepet bulunamadı.");

        var item = cart.CartItems.FirstOrDefault(ci => ci.Id == itemId);
        if (item is null)
            return ApiResponse<CartDto>.Fail("Sepet öğesi bulunamadı.");

        if (item.Product.StockQuantity < dto.Quantity)
            return ApiResponse<CartDto>.Fail("Yetersiz stok.");

        item.Quantity = dto.Quantity;
        item.UpdatedAt = DateTime.UtcNow;
        await _cartRepository.UpdateAsync(cart);

        var updatedCart = await _cartRepository.GetWithItemsAsync(userId);
        return ApiResponse<CartDto>.Ok(_mapper.Map<CartDto>(updatedCart!), "Sepet güncellendi.");
    }

    public async Task<ApiResponse<bool>> RemoveItemAsync(int userId, int itemId)
    {
        var cart = await _cartRepository.GetWithItemsAsync(userId);
        if (cart is null)
            return ApiResponse<bool>.Fail("Sepet bulunamadı.");

        var item = cart.CartItems.FirstOrDefault(ci => ci.Id == itemId);
        if (item is null)
            return ApiResponse<bool>.Fail("Sepet öğesi bulunamadı.");

        await _cartRepository.RemoveCartItemAsync(item);
        return ApiResponse<bool>.Ok(true, "Ürün sepetten kaldırıldı.");
    }

    public async Task<ApiResponse<bool>> ClearCartAsync(int userId)
    {
        var cart = await _cartRepository.GetWithItemsAsync(userId);
        if (cart is null)
            return ApiResponse<bool>.Fail("Sepet bulunamadı.");

        foreach (var item in cart.CartItems.ToList())
        {
            await _cartRepository.RemoveCartItemAsync(item);
        }

        return ApiResponse<bool>.Ok(true, "Sepet temizlendi.");
    }
}
