package com.paf.cookMate.Service.Impl;

import com.paf.cookMate.Model.Chat;
import com.paf.cookMate.Repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.paf.cookMate.Service.ChatService;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;

    @Override
    public Chat saveChat(Chat chat) {
        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }

    @Override
    public List<Chat> getChatsByUserId(String userId) {
        return chatRepository.findByUserId(userId);
    }

    @Override
    public Chat updateChat(String id, String newPrompt) {
        Chat chat = chatRepository.findById(id).orElseThrow();
        chat.setPrompt(newPrompt);
        return chatRepository.save(chat);
    }

    @Override
    public void deleteChat(String id) {
        chatRepository.deleteById(id);
    }
}
