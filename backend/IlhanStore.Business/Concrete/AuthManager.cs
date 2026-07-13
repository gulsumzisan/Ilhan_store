using AutoMapper;
using IlhanStore.Business.Abstract;
using IlhanStore.Business.Configuration;
using IlhanStore.Business.DTOs.Auth;
using IlhanStore.Business.DTOs.Common;
using IlhanStore.Business.DTOs.User;
using IlhanStore.DataAccess.Abstract;
using IlhanStore.Entity.Entities;
using IlhanStore.Entity.Enums;

namespace IlhanStore.Business.Concrete;

public class AuthManager : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ICartRepository _cartRepository;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AuthManager(
        IUserRepository userRepository,
        ICartRepository cartRepository,
        ITokenService tokenService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _cartRepository = cartRepository;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        if (await _userRepository.ExistsAsync(u => u.Email == dto.Email))
            return ApiResponse<AuthResponseDto>.Fail("Bu e-posta adresi zaten kayıtlı.");

        var user = _mapper.Map<User>(dto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        user.Role = UserRole.Customer;

        await _userRepository.AddAsync(user);
        await _cartRepository.AddAsync(new Cart { UserId = user.Id });

        var token = _tokenService.GenerateToken(user);
        return ApiResponse<AuthResponseDto>.Ok(new AuthResponseDto
        {
            Token = token,
            User = _mapper.Map<UserDto>(user)
        }, "Kayıt başarılı.");
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return ApiResponse<AuthResponseDto>.Fail("E-posta veya şifre hatalı.");

        if (!user.IsActive)
            return ApiResponse<AuthResponseDto>.Fail("Hesabınız devre dışı bırakılmış.");

        var token = _tokenService.GenerateToken(user);
        return ApiResponse<AuthResponseDto>.Ok(new AuthResponseDto
        {
            Token = token,
            User = _mapper.Map<UserDto>(user)
        }, "Giriş başarılı.");
    }
}
