using AutoMapper;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.DTOs.Common;
using IlhanStore.Business.DTOs.Order;
using IlhanStore.DataAccess.Abstract;
using IlhanStore.Entity.Entities;
using IlhanStore.Entity.Enums;

namespace IlhanStore.Business.Concrete;

public class OrderManager : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public OrderManager(
        IOrderRepository orderRepository,
        ICartRepository cartRepository,
        IProductRepository productRepository,
        IMapper mapper)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<OrderDto>> CreateFromCartAsync(int userId, CreateOrderDto dto)
    {
        var cart = await _cartRepository.GetWithItemsAsync(userId);
        if (cart is null || !cart.CartItems.Any())
            return ApiResponse<OrderDto>.Fail("Sepetiniz boş.");

        foreach (var item in cart.CartItems)
        {
            if (item.Product.StockQuantity < item.Quantity)
                return ApiResponse<OrderDto>.Fail($"'{item.Product.Name}' için yetersiz stok.");
        }

        var order = new Order
        {
            UserId = userId,
            OrderNumber = GenerateOrderNumber(),
            ShippingAddress = dto.ShippingAddress,
            Notes = dto.Notes,
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Pending
        };

        decimal total = 0;
        foreach (var cartItem in cart.CartItems)
        {
            var unitPrice = cartItem.Product.DiscountPrice ?? cartItem.Product.Price;
            order.OrderItems.Add(new OrderItem
            {
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                UnitPrice = unitPrice
            });
            total += unitPrice * cartItem.Quantity;

            cartItem.Product.StockQuantity -= cartItem.Quantity;
            await _productRepository.UpdateAsync(cartItem.Product);
        }

        order.TotalAmount = total;
        await _orderRepository.AddAsync(order);

        cart.CartItems.Clear();
        await _cartRepository.UpdateAsync(cart);

        var createdOrder = await _orderRepository.GetWithItemsAsync(order.Id);
        return ApiResponse<OrderDto>.Ok(_mapper.Map<OrderDto>(createdOrder!), "Sipariş oluşturuldu.");
    }

    public async Task<ApiResponse<IEnumerable<OrderDto>>> GetByUserIdAsync(int userId)
    {
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return ApiResponse<IEnumerable<OrderDto>>.Ok(_mapper.Map<IEnumerable<OrderDto>>(orders));
    }

    public async Task<ApiResponse<OrderDto>> GetByIdAsync(int id)
    {
        var order = await _orderRepository.GetWithItemsAsync(id);
        if (order is null)
            return ApiResponse<OrderDto>.Fail("Sipariş bulunamadı.");

        return ApiResponse<OrderDto>.Ok(_mapper.Map<OrderDto>(order));
    }

    public async Task<ApiResponse<IEnumerable<OrderDto>>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllWithDetailsAsync();
        return ApiResponse<IEnumerable<OrderDto>>.Ok(_mapper.Map<IEnumerable<OrderDto>>(orders));
    }

    public async Task<ApiResponse<OrderDto>> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order is null)
            return ApiResponse<OrderDto>.Fail("Sipariş bulunamadı.");

        order.Status = dto.Status;
        if (dto.PaymentStatus.HasValue)
            order.PaymentStatus = dto.PaymentStatus.Value;

        order.UpdatedAt = DateTime.UtcNow;
        await _orderRepository.UpdateAsync(order);

        var updated = await _orderRepository.GetWithItemsAsync(id);
        return ApiResponse<OrderDto>.Ok(_mapper.Map<OrderDto>(updated!), "Sipariş durumu güncellendi.");
    }

    private static string GenerateOrderNumber() =>
        $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
}
