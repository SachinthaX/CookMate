package com.paf.cookMate.Config;

import com.paf.cookMate.Repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;

@Configuration
@EnableScheduling
public class SessionCleanupTask {

    @Autowired
    private UserSessionRepository sessionRepository;
    
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        sessionRepository.deleteByExpiresAtLessThan(now);
    }
} 