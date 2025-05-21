package com.paf.cookMate.Service;

import com.paf.cookMate.Model.Chat;
import java.util.List;

public interface ChatService {
    Chat saveChat(Chat chat);
    List<Chat> getChatsByUserId(String userId);
    Chat updateChat(String id, String newPrompt);
    void deleteChat(String id);
}
