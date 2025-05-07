package com.paf.cookMate.Controller;

import com.paf.cookMate.Dto.NotificationDto;
import com.paf.cookMate.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationDto> createNotification(@RequestBody NotificationDto notificationDto) {
        NotificationDto createdNotification = notificationService.createNotification(notificationDto);
        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationDto> getNotificationById(@PathVariable String id) {
        NotificationDto notification = notificationService.getNotificationById(id);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByUser(@PathVariable String userId) {
        List<NotificationDto> notifications = notificationService.getNotificationsByUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotificationsByUser(@PathVariable String userId) {
        List<NotificationDto> notifications = notificationService.getUnreadNotificationsByUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationCount(@PathVariable String userId) {
        long count = notificationService.getUnreadNotificationCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable String id) {
        NotificationDto notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
} 