package com.paf.cookMate.Service.Impl;

import com.paf.cookMate.Dto.*;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSessionRepository sessionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.session.duration:24}")
    private int sessionDurationHours;

    @Override
    public ResponseEntity<?> followUser(String targetUserId, User currentUser) {
        Optional<User> targetOpt = userRepository.findById(targetUserId);
        if (targetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Target user not found");
        }

        User targetUser = targetOpt.get();

        if (!currentUser.getFollowing().contains(targetUserId)) {
            currentUser.getFollowing().add(targetUserId);
            targetUser.getFollowers().add(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(targetUser);
        }

        return ResponseEntity.ok("Followed successfully");
    }

    @Override
    public ResponseEntity<?> unfollowUser(String targetUserId, User currentUser) {
        Optional<User> targetOpt = userRepository.findById(targetUserId);
        if (targetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Target user not found");
        }

        User targetUser = targetOpt.get();
        currentUser.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(currentUser.getId());

        userRepository.save(currentUser);
        userRepository.save(targetUser);

        return ResponseEntity.ok("Unfollowed successfully");
    }

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
        if (!Objects.equals(registerRequest.getPassword(), registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
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
        response.setToken(sessionId);
        response.setSuccess(true);
        response.setMessage("Registration successful");
        return response;
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            AuthResponse failResponse = new AuthResponse();
            failResponse.setSuccess(false);
            failResponse.setMessage("Invalid email or password");
            return failResponse;
        }

        User user = userOpt.get();
        if (!user.isActive()) {
            AuthResponse failResponse = new AuthResponse();
            failResponse.setSuccess(false);
            failResponse.setMessage("Account is deactivated");
            return failResponse;
        }

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
        if (userDto.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(userDto.getPhoneNumber());
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

    // ✅ NEW: Delete Account Permanently
    public void deleteCurrentUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        userRepository.deleteById(userId);
        sessionRepository.deleteAll(sessionRepository.findByUserId(userId));
    }

    // // ✅ NEW: Change Password
    // public void changePassword(String userId, PasswordChangeRequest request) {
    //     User user = userRepository.findById(userId)
    //             .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

    //     if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
    //         throw new BadRequestException("Old password is incorrect");
    //     }

    //     user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    //     user.setUpdatedAt(LocalDateTime.now());
    //     userRepository.save(user);
    // }

    // inside your UserServiceImpl:

@Override
public void changePassword(String userId, PasswordChangeRequest request) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

    // 🔒 NEW GUARD: if they signed up via OAuth only, no password is set
    if (user.getPassword() == null || user.getPassword().isEmpty()) {
        throw new BadRequestException("No existing password on account; cannot change password");
    }

    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        throw new BadRequestException("Old password is incorrect");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    user.setUpdatedAt(LocalDateTime.now());
    userRepository.save(user);
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

            return sessionOpt.map(UserSession::getUserId).orElse(null);
        } catch (Exception e) {
            System.out.println("Error validating token: " + e.getMessage());
            return null;
        }
    }

    private String createSessionForUser(String userId) {
        String sessionId = UUID.randomUUID().toString();
        UserSession session = new UserSession();
        session.setUserId(userId);
        session.setSessionId(sessionId);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(sessionDurationHours));
        session.setActive(true);
        sessionRepository.save(session);
        return sessionId;
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        BeanUtils.copyProperties(user, dto);
        dto.setPassword(null); // mask password
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFollowers(user.getFollowers());
        dto.setFollowing(user.getFollowing());
        return dto;
    }
}
