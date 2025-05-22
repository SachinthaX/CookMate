package com.paf.cookMate.Controller;

import com.paf.cookMate.Model.Chat;
import com.paf.cookMate.Service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<Chat> createChat(@RequestBody Chat chat) {
        return ResponseEntity.ok(chatService.saveChat(chat));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Chat>> getChats(@PathVariable String userId) {
        return ResponseEntity.ok(chatService.getChatsByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chat> updateChat(@PathVariable String id, @RequestBody String newPrompt) {
        return ResponseEntity.ok(chatService.updateChat(id, newPrompt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChat(@PathVariable String id) {
        chatService.deleteChat(id);
        return ResponseEntity.noContent().build();
    }
}
