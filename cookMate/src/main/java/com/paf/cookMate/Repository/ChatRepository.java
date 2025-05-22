package com.paf.cookMate.Repository;

import com.paf.cookMate.Model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findByUserId(String userId);
}
