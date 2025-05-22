package com.paf.cookMate.Security;

import com.paf.cookMate.Model.User;
import com.paf.cookMate.Model.UserSession;
import com.paf.cookMate.Repository.UserRepository;
import com.paf.cookMate.Repository.UserSessionRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class SessionAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            // 1️⃣ Try Mongo session lookup
            Optional<UserSession> sessionOpt = sessionRepository
                    .findBySessionIdAndActiveIsTrueAndExpiresAtGreaterThan(
                            token, LocalDateTime.now()
                    );

            if (sessionOpt.isPresent()) {
                authenticate(sessionOpt.get().getUserId(), request);
            } else {
                // 2️⃣ Fallback to JWT validation
                try {
                    if (jwtUtil.isTokenValid(token)) {
                        Claims claims = jwtUtil.getClaimsFromToken(token);
                        authenticate(claims.getSubject(), request);
                    }
                } catch (Exception ignored) {
                    // invalid JWT → no authentication
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(String userId, HttpServletRequest request) {
        userRepository.findById(userId).ifPresent(user -> {
            var auth = new UsernamePasswordAuthenticationToken(
                    user, null, null
            );
            auth.setDetails(new WebAuthenticationDetailsSource()
                    .buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        });
    }
}
