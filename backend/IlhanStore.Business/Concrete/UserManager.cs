using AutoMapper;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.DTOs.Common;
using IlhanStore.Business.DTOs.User;
using IlhanStore.DataAccess.Abstract;

namespace IlhanStore.Business.Concrete;

public class UserManager : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserManager(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<UserDto>> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user is null || !user.IsActive)
            return ApiResponse<UserDto>.Fail("Kullanıcı bulunamadı.");

        return ApiResponse<UserDto>.Ok(_mapper.Map<UserDto>(user));
    }

    public async Task<ApiResponse<UserDto>> UpdateAsync(int id, UpdateUserDto dto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user is null)
            return ApiResponse<UserDto>.Fail("Kullanıcı bulunamadı.");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PhoneNumber = dto.PhoneNumber;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
        return ApiResponse<UserDto>.Ok(_mapper.Map<UserDto>(user), "Profil güncellendi.");
    }

    public async Task<ApiResponse<IEnumerable<UserDto>>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return ApiResponse<IEnumerable<UserDto>>.Ok(
            _mapper.Map<IEnumerable<UserDto>>(users.Where(u => u.IsActive)));
    }
}
