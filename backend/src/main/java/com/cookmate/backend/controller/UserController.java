package com.cookmate.backend.controller;

import com.cookmate.backend.model.User;
import com.cookmate.backend.repository.UserRepository;
import com.cookmate.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtProvider;

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String header) {
        String token = header.replace("Bearer ", "");
        String userId = jwtProvider.getUserIdFromJWT(token);
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String header,
                                           @RequestBody User update) {
        String token = header.replace("Bearer ", "");
        String userId = jwtProvider.getUserIdFromJWT(token);

        return userRepository.findById(userId).map(user -> {
            user.setName(update.getName());
            user.setBio(update.getBio());
            user.setAvatarUrl(update.getAvatarUrl());
            return ResponseEntity.ok(userRepository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteProfile(@RequestHeader("Authorization") String header) {
        String token = header.replace("Bearer ", "");
        String userId = jwtProvider.getUserIdFromJWT(token);
        userRepository.deleteById(userId);
        return ResponseEntity.ok("Deleted");
    }

    // 🔁 Follow another user
@PutMapping("/follow/{id}")
public ResponseEntity<?> followUser(@RequestHeader("Authorization") String header,
                                    @PathVariable String id) {
    String token = header.replace("Bearer ", "");
    String userId = jwtProvider.getUserIdFromJWT(token);

    if (userId.equals(id)) {
        return ResponseEntity.badRequest().body("You cannot follow yourself.");
    }

    User current = userRepository.findById(userId).orElse(null);
    User target = userRepository.findById(id).orElse(null);

    if (current == null || target == null) return ResponseEntity.notFound().build();

    if (!current.getFollowing().contains(id)) {
        current.getFollowing().add(id);
        target.getFollowers().add(userId);
        userRepository.save(current);
        userRepository.save(target);
    }
    System.out.println("User " + userId + " followed " + id);
    return ResponseEntity.ok("Followed successfully");
}

// 🔁 Unfollow another user
@PutMapping("/unfollow/{id}")
public ResponseEntity<?> unfollowUser(@RequestHeader("Authorization") String header,
                                      @PathVariable String id) {
    String token = header.replace("Bearer ", "");
    String userId = jwtProvider.getUserIdFromJWT(token);

    User current = userRepository.findById(userId).orElse(null);
    User target = userRepository.findById(id).orElse(null);

    if (current == null || target == null) return ResponseEntity.notFound().build();

    if (current.getFollowing().contains(id)) {
        current.getFollowing().remove(id);
        target.getFollowers().remove(userId);
        userRepository.save(current);
        userRepository.save(target);
    }

    return ResponseEntity.ok("Unfollowed successfully");
}

    
}
