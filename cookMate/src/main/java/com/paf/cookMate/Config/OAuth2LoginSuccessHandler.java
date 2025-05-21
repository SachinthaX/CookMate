// src/main/java/com/paf/cookMate/Config/OAuth2LoginSuccessHandler.java
package com.paf.cookMate.Config;

import com.paf.cookMate.Model.User;
import com.paf.cookMate.Repository.UserRepository;
import com.paf.cookMate.Security.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private static final String FRONTEND_BASE = "http://localhost:5173";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
public void onAuthenticationSuccess(HttpServletRequest request,
                                    HttpServletResponse response,
                                    Authentication authentication) throws IOException {
    try {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
final String picture;
Object picAttr = oAuth2User.getAttribute("picture");
if (picAttr instanceof String) {
    picture = (String) picAttr;
} else if (picAttr instanceof Map) {
    picture = ((Map<?, ?>) picAttr).get("data") instanceof Map
        ? (String) ((Map<?, ?>) ((Map<?, ?>) picAttr).get("data")).get("url")
        : null;
} else {
    picture = null;
}


        System.out.println("OAuth login success:");
        System.out.println("Email: " + email);
        System.out.println("Name: " + name);
        System.out.println("Picture: " + picture);

        if (email == null) {
            throw new RuntimeException("Email is null from OAuth2 provider");
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setProfilePicture(picture);
                    return userRepository.save(newUser);
                });

        String token = jwtUtil.generateToken(user);

        String redirectUrl = "http://localhost:5173/oauth-success" +
                "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8) +
                "&name=" + URLEncoder.encode(user.getName(), StandardCharsets.UTF_8) +
                "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);

        System.out.println("Redirecting to: " + redirectUrl);
        response.sendRedirect(redirectUrl);

    } catch (Exception e) {
        System.out.println("OAuth2LoginSuccessHandler failed:");
        e.printStackTrace(); // 🔥 This will reveal the true cause in the Spring console
        response.sendRedirect("http://localhost:5173/login?error=oauth");
    }
}


}
