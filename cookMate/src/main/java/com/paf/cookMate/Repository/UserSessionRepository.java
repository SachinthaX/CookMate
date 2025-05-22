package com.paf.cookMate.Repository;

import com.paf.cookMate.Model.UserSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserSessionRepository extends MongoRepository<UserSession, String> {
    
    List<UserSession> findByUserIdAndActiveIsTrue(String userId);

    Optional<UserSession> findByUserIdAndSessionIdAndActiveIsTrueAndExpiresAtGreaterThan(
            String userId, String sessionId, LocalDateTime time);

    Optional<UserSession> findBySessionIdAndActiveIsTrueAndExpiresAtGreaterThan(
            String sessionId, LocalDateTime time);

    // ✅ Add this method for full user deletion
    List<UserSession> findByUserId(String userId);

    void deleteByExpiresAtLessThan(java.time.LocalDateTime time);

}
