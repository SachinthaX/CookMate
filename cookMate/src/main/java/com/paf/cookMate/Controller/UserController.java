package com.paf.cookMate.Controller;

import com.paf.cookMate.Dto.UserDto;
import com.paf.cookMate.Service.UserService;
import com.paf.cookMate.Config.CurrentUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@CurrentUser String userId) {
        // The @CurrentUser annotation automatically injects the current user ID
        return ResponseEntity.ok(userService.getUserById(userId));
    }
    
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(
            @CurrentUser String userId,
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(userId, userDto));
    }
    
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(@CurrentUser String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
} 