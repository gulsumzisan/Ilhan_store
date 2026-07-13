using IlhanStore.API.Configuration;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.DTOs.Cart;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IlhanStore.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var result = await _cartService.GetCartAsync(User.GetUserId());
        return Ok(result);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddToCartDto dto)
    {
        var result = await _cartService.AddItemAsync(User.GetUserId(), dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("items/{itemId:int}")]
    public async Task<IActionResult> UpdateItem(int itemId, [FromBody] UpdateCartItemDto dto)
    {
        var result = await _cartService.UpdateItemAsync(User.GetUserId(), itemId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("items/{itemId:int}")]
    public async Task<IActionResult> RemoveItem(int itemId)
    {
        var result = await _cartService.RemoveItemAsync(User.GetUserId(), itemId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var result = await _cartService.ClearCartAsync(User.GetUserId());
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
