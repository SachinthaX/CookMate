package com.paf.cookMate.Repository;

import com.paf.cookMate.Model.UserSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends MongoRepository<UserSession, String> {
    Optional<UserSession> findByUserIdAndSessionIdAndActiveIsTrueAndExpiresAtGreaterThan(
            String userId, String sessionId, LocalDateTime now);
    
    Optional<UserSession> findBySessionIdAndActiveIsTrueAndExpiresAtGreaterThan(
            String sessionId, LocalDateTime now);
    
    List<UserSession> findByUserIdAndActiveIsTrue(String userId);
    
    void deleteByExpiresAtLessThan(LocalDateTime now);
} 