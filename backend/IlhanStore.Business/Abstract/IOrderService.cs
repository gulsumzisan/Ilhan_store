using IlhanStore.Business.DTOs.Common;
using IlhanStore.Business.DTOs.Order;

namespace IlhanStore.Business.Abstract;

public interface IOrderService
{
    Task<ApiResponse<OrderDto>> CreateFromCartAsync(int userId, CreateOrderDto dto);
    Task<ApiResponse<IEnumerable<OrderDto>>> GetByUserIdAsync(int userId);
    Task<ApiResponse<OrderDto>> GetByIdAsync(int id);
    Task<ApiResponse<IEnumerable<OrderDto>>> GetAllAsync();
    Task<ApiResponse<OrderDto>> UpdateStatusAsync(int id, UpdateOrderStatusDto dto);
}
