package com.paf.cookMate.Service;

import com.paf.cookMate.Dto.AuthResponse;
import com.paf.cookMate.Dto.LoginRequest;
import com.paf.cookMate.Dto.RegisterRequest;
import com.paf.cookMate.Dto.UserDto;

import java.util.List;

public interface UserService {
    UserDto getUserById(String id);
    List<UserDto> getAllUsers();
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    UserDto updateUser(String id, UserDto userDto);
    void deleteUser(String id);
    boolean validateSession(String userId, String sessionId);
    String validateToken(String token);
} 