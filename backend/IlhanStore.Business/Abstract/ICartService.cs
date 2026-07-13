using IlhanStore.Business.DTOs.Cart;
using IlhanStore.Business.DTOs.Common;

namespace IlhanStore.Business.Abstract;

public interface ICartService
{
    Task<ApiResponse<CartDto>> GetCartAsync(int userId);
    Task<ApiResponse<CartDto>> AddItemAsync(int userId, AddToCartDto dto);
    Task<ApiResponse<CartDto>> UpdateItemAsync(int userId, int itemId, UpdateCartItemDto dto);
    Task<ApiResponse<bool>> RemoveItemAsync(int userId, int itemId);
    Task<ApiResponse<bool>> ClearCartAsync(int userId);
}
