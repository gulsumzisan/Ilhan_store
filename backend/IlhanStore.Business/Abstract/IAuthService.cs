using IlhanStore.Business.DTOs.Auth;
using IlhanStore.Business.DTOs.Common;

namespace IlhanStore.Business.Abstract;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto);
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto);
}
