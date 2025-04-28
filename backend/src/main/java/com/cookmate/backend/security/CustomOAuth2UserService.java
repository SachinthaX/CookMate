package com.cookmate.backend.security;

import com.cookmate.backend.model.User;
import com.cookmate.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String avatar = (String) attributes.get("picture");

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;

        if (userOpt.isEmpty()) {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .avatarUrl(avatar)
                    .role("USER")
                    .followers(new ArrayList<>())
                    .following(new ArrayList<>())
                    .createdAt(Instant.now())
                    .build();
            userRepository.save(user);
            System.out.println("✅ New user created: " + email);
        } else {
            user = userOpt.get();
            user.setName(name);
            user.setAvatarUrl(avatar);
            userRepository.save(user);
            System.out.println("🔁 Existing user updated: " + email);
        }

        return new CookmateOAuth2User(oAuth2User.getAuthorities(), attributes, "email");

    }
}
