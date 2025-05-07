package com.paf.cookMate.Service.Impl;

import com.paf.cookMate.Dto.AuthResponse;
import com.paf.cookMate.Dto.LoginRequest;
import com.paf.cookMate.Dto.RegisterRequest;
import com.paf.cookMate.Dto.UserDto;
import com.paf.cookMate.Exception.BadRequestException;
import com.paf.cookMate.Exception.ResourceNotFoundException;
import com.paf.cookMate.Model.User;
import com.paf.cookMate.Model.UserSession;
import com.paf.cookMate.Repository.UserRepository;
import com.paf.cookMate.Repository.UserSessionRepository;
import com.paf.cookMate.Service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserSessionRepository sessionRepository;
    
    @Value("${app.session.duration:24}")
    private int sessionDurationHours;
    
    @Override
    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return convertToDto(user);
    }
    
    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        // Validate password match
        if (!Objects.equals(registerRequest.getPassword(), registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already in use");
        }
        
        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        
        String sessionId = createSessionForUser(savedUser.getId());
        
        AuthResponse response = new AuthResponse();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setProfilePicture(savedUser.getProfilePicture());
        response.setSessionId(sessionId);
        // Use session ID as token for now
        response.setToken(sessionId);
        response.setSuccess(true);
        response.setMessage("Registration successful");
        
        return response;
    }
    
    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by email
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        
        // Check if user exists and password matches
        if (userOpt.isEmpty() || !Objects.equals(userOpt.get().getPassword(), loginRequest.getPassword())) {
            AuthResponse failResponse = new AuthResponse();
            failResponse.setSuccess(false);
            failResponse.setMessage("Invalid email or password");
            return failResponse;
        }
        
        User user = userOpt.get();
        
        // Check if user is active
        if (!user.isActive()) {
            AuthResponse failResponse = new AuthResponse();
            failResponse.setSuccess(false);
            failResponse.setMessage("Account is deactivated");
            return failResponse;
        }
        
        // Create session
        String sessionId = createSessionForUser(user.getId());
        
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setProfilePicture(user.getProfilePicture());
        response.setSessionId(sessionId);
        response.setToken(sessionId);
        response.setSuccess(true);
        response.setMessage("Login successful");
        
        return response;
    }
    
    @Override
    public UserDto updateUser(String id, UserDto userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        if (userDto.getName() != null) {
            existingUser.setName(userDto.getName());
        }
        
        if (userDto.getProfilePicture() != null) {
            existingUser.setProfilePicture(userDto.getProfilePicture());
        }
        
        if (userDto.getBio() != null) {
            existingUser.setBio(userDto.getBio());
        }
        

        existingUser.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(existingUser);
        return convertToDto(updatedUser);
    }
    
    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        

        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        List<UserSession> activeSessions = sessionRepository.findByUserIdAndActiveIsTrue(id);
        for (UserSession session : activeSessions) {
            session.setActive(false);
            sessionRepository.save(session);
        }
    }
    
    @Override
    public boolean validateSession(String userId, String sessionId) {
        if (userId == null || sessionId == null) {
            return false;
        }
        
        Optional<UserSession> sessionOpt = sessionRepository.findByUserIdAndSessionIdAndActiveIsTrueAndExpiresAtGreaterThan(
                userId, sessionId, LocalDateTime.now());
        
        return sessionOpt.isPresent();
    }
    
    @Override
    public String validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        try {
            Optional<UserSession> sessionOpt = sessionRepository.findBySessionIdAndActiveIsTrueAndExpiresAtGreaterThan(
                    token, LocalDateTime.now());
            
            if (sessionOpt.isPresent()) {
                return sessionOpt.get().getUserId();
            }
            
            return null;
        } catch (Exception e) {
            System.out.println("Error validating token: " + e.getMessage());
            return null;
        }
    }
    

    private String createSessionForUser(String userId) {
        // Generate a random session ID
        String sessionId = UUID.randomUUID().toString();
        
        // Create new session
        UserSession session = new UserSession();
        session.setUserId(userId);
        session.setSessionId(sessionId);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(sessionDurationHours));
        session.setActive(true);
        
        // Save session
        sessionRepository.save(session);
        
        return sessionId;
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        BeanUtils.copyProperties(user, dto);
        // Don't include password in the DTO for security reasons
        dto.setPassword(null);
        return dto;
    }
} 