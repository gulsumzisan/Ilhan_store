using IlhanStore.Business.DTOs.Common;
using IlhanStore.Business.DTOs.User;

namespace IlhanStore.Business.Abstract;

public interface IUserService
{
    Task<ApiResponse<UserDto>> GetByIdAsync(int id);
    Task<ApiResponse<UserDto>> UpdateAsync(int id, UpdateUserDto dto);
    Task<ApiResponse<IEnumerable<UserDto>>> GetAllAsync();
}
