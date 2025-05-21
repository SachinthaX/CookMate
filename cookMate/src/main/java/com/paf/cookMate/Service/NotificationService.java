package com.paf.cookMate.Service;

import com.paf.cookMate.Dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    NotificationDto createNotification(NotificationDto notificationDto);
    NotificationDto getNotificationById(String id);
    List<NotificationDto> getNotificationsByUser(String userId);
    List<NotificationDto> getUnreadNotificationsByUser(String userId);
    long getUnreadNotificationCount(String userId);
    NotificationDto markAsRead(String id);
    void markAllAsRead(String userId);
    void deleteNotification(String id);
} 