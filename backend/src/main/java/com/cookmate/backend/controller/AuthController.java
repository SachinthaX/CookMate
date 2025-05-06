package com.paf.cookMate.Controller;

import com.paf.cookMate.Dto.AuthResponse;
import com.paf.cookMate.Dto.LoginRequest;
import com.paf.cookMate.Dto.RegisterRequest;
import com.paf.cookMate.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest, HttpServletResponse response) {
        AuthResponse authResponse = userService.register(registerRequest);
        
        if (authResponse.isSuccess()) {
            // Store session ID in a cookie
            addSessionCookie(response, authResponse.getId(), authResponse.getSessionId());
        }
        
        return new ResponseEntity<>(authResponse, authResponse.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        AuthResponse authResponse = userService.login(loginRequest);
        
        if (authResponse.isSuccess()) {
            addSessionCookie(response, authResponse.getId(), authResponse.getSessionId());
            
            response.addHeader("Authorization", "Bearer " + authResponse.getToken());
        }
        
        return ResponseEntity.ok(authResponse);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie userIdCookie = new Cookie("userId", "");
        userIdCookie.setMaxAge(0);
        userIdCookie.setPath("/");
        response.addCookie(userIdCookie);
        
        Cookie sessionCookie = new Cookie("sessionId", "");
        sessionCookie.setMaxAge(0);
        sessionCookie.setPath("/");
        response.addCookie(sessionCookie);
        
        return ResponseEntity.ok().build();
    }
    
    private void addSessionCookie(HttpServletResponse response, String userId, String sessionId) {
        Cookie userIdCookie = new Cookie("userId", userId);
        userIdCookie.setMaxAge(24 * 60 * 60); // 24 hours
        userIdCookie.setPath("/");
        userIdCookie.setHttpOnly(true);
        userIdCookie.setSecure(false); // Only sent over HTTPS
        // Modern browsers require SameSite attribute
        response.addHeader("Set-Cookie", userIdCookie.getName() + "=" + userIdCookie.getValue() 
            + "; Max-Age=" + userIdCookie.getMaxAge() 
            + "; Path=" + userIdCookie.getPath() 
            + "; HttpOnly"
            + "; SameSite=Lax");
        
        Cookie sessionCookie = new Cookie("sessionId", sessionId);
        sessionCookie.setMaxAge(24 * 60 * 60); // 24 hours
        sessionCookie.setPath("/");
        sessionCookie.setHttpOnly(true);
        sessionCookie.setSecure(false);
        response.addHeader("Set-Cookie", sessionCookie.getName() + "=" + sessionCookie.getValue()
            + "; Max-Age=" + sessionCookie.getMaxAge() 
            + "; Path=" + sessionCookie.getPath() 
            + "; HttpOnly"
            + "; SameSite=Lax");
    }
} 