package com.paf.cookMate.Config;

import com.paf.cookMate.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Optional;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        if (isPublicEndpoint(request.getRequestURI())) {
            System.out.println("Public endpoint: " + request.getRequestURI() + " - no auth required");
            return true;
        }
        

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = userService.validateToken(token);
            
            if (userId != null) {
                // Valid token
                System.out.println("Valid token authentication for user: " + userId);
                request.setAttribute("userId", userId);
                return true;
            }
            
            System.out.println("Invalid token provided");
        }
        
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            System.out.println("No cookies found");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        
        // Extract user ID and session ID from cookies
        Optional<Cookie> userIdCookie = Arrays.stream(cookies)
                .filter(cookie -> "userId".equals(cookie.getName()))
                .findFirst();
        
        Optional<Cookie> sessionCookie = Arrays.stream(cookies)
                .filter(cookie -> "sessionId".equals(cookie.getName()))
                .findFirst();
        
        // If either cookie is missing, return unauthorized
        if (userIdCookie.isEmpty() || sessionCookie.isEmpty()) {
            System.out.println("Missing required cookies for authentication");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        
        // Validate session
        String userId = userIdCookie.get().getValue();
        String sessionId = sessionCookie.get().getValue();
        
        if (!userService.validateSession(userId, sessionId)) {
            System.out.println("Invalid session for user: " + userId);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        
        // Set user ID in request attributes for controller use
        System.out.println("Valid cookie authentication for user: " + userId);
        request.setAttribute("userId", userId);
        
        return true;
    }
    
    private boolean isPublicEndpoint(String uri) {
        // Define public endpoints that don't require authentication
        return uri.startsWith("/api/auth/") || 
               uri.equals("/api/recipes") || 
               uri.startsWith("/api/recipes/") && !uri.contains("/edit") ||
               uri.equals("/api/learning-plans") ||
               uri.startsWith("/api/learning-plans/") && !uri.contains("/create");
    }
} 