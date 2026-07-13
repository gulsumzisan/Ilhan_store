using IlhanStore.API.Configuration;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.DTOs.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IlhanStore.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var result = await _orderService.CreateFromCartAsync(User.GetUserId(), dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        if (User.IsAdmin())
        {
            var allOrders = await _orderService.GetAllAsync();
            return Ok(allOrders);
        }

        var result = await _orderService.GetByUserIdAsync(User.GetUserId());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _orderService.GetByIdAsync(id);
        if (!result.Success)
            return NotFound(result);

        if (!User.IsAdmin() && result.Data is not null)
        {
            var userId = User.GetUserId();
            var userOrders = await _orderService.GetByUserIdAsync(userId);
            if (userOrders.Data?.All(o => o.Id != id) == true)
                return Forbid();
        }

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var result = await _orderService.UpdateStatusAsync(id, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
