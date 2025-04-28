package com.cookmate.backend.security;

import com.cookmate.backend.model.User;
import com.cookmate.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
//import java.util.Optional;

import java.io.IOException;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtProvider;
    private final UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // @Override
    // public void onAuthenticationSuccess(HttpServletRequest request,
    //                                     HttpServletResponse response,
    //                                     Authentication authentication) throws IOException {

        
    //     CookmateOAuth2User oAuth2User = (CookmateOAuth2User) authentication.getPrincipal();
    //     String email = oAuth2User.getEmail();
                                            
    //     System.out.println("✅ Login Success Handler triggered. Email: " + email);

    //     User user = userRepository.findByEmail(email)
    //         .orElseThrow(() -> new RuntimeException("User not found after OAuth login"));

    //     String token = jwtProvider.generateToken(user.getId(), user.getEmail());

    //     response.sendRedirect(frontendUrl + "/oauth2/success?token=" + token);
    // }

    // @Override
    // public void onAuthenticationSuccess(HttpServletRequest request,
    //                                     HttpServletResponse response,
    //                                     Authentication authentication) throws IOException {

    //     // This handles both DefaultOidcUser and DefaultOAuth2User
    //     String email = ((OAuth2User) authentication.getPrincipal()).getAttribute("email");
    //     System.out.println("🔐 Login Success Handler triggered. Email: " + email);

    //     Optional<User> optionalUser = userRepository.findByEmail(email);

    //     if (optionalUser.isEmpty()) {
    //         System.out.println("❌ User not found in DB after OAuth login.");
    //         response.sendRedirect(frontendUrl + "/oauth2/error");
    //         return;
    //     }

    //     User user = optionalUser.get();
    //     String token = jwtProvider.generateToken(user.getId(), user.getEmail());

    //     response.sendRedirect(frontendUrl + "/oauth2/success?token=" + token);
    // }

    @Override
public void onAuthenticationSuccess(HttpServletRequest request,
                                     HttpServletResponse response,
                                     Authentication authentication) throws IOException {

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = (String) oAuth2User.getAttributes().get("email");
    String name = (String) oAuth2User.getAttributes().get("name");
    String avatarUrl = (String) oAuth2User.getAttributes().get("picture");

    System.out.println("🔐 Login Success Handler triggered. Email: " + email);

    // 🆕 Check if user exists
    User user = userRepository.findByEmail(email).orElseGet(() -> {
        System.out.println("🆕 New user created in DB: " + email);
        User newUser = User.builder()
                .email(email)
                .name(name)
                .avatarUrl(avatarUrl)
                .role("USER")
                .followers(new ArrayList<>())
                .following(new ArrayList<>())
                .createdAt(Instant.now())
                .build();
        return userRepository.save(newUser);
    });

    String token = jwtProvider.generateToken(user.getId(), user.getEmail());
    response.sendRedirect(frontendUrl + "/oauth2/success?token=" + token);
}

    

}
