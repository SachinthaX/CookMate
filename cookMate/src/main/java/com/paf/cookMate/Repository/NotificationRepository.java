package com.paf.cookMate.Repository;

import com.paf.cookMate.Model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndReadOrderByCreatedAtDesc(String userId, boolean read);
    long countByUserIdAndRead(String userId, boolean read);
} 