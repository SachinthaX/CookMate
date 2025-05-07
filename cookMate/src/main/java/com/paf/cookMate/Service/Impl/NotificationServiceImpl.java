package com.paf.cookMate.Service.Impl;

import com.paf.cookMate.Dto.NotificationDto;
import com.paf.cookMate.Model.Notification;
import com.paf.cookMate.Repository.NotificationRepository;
import com.paf.cookMate.Service.NotificationService;
import com.paf.cookMate.Exception.ResourceNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public NotificationDto createNotification(NotificationDto notificationDto) {
        Notification notification = convertToEntity(notificationDto);
        
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        
        // Initialize read status to false for new notifications
        notification.setRead(false);
        
        Notification savedNotification = notificationRepository.save(notification);
        return convertToDto(savedNotification);
    }

    @Override
    public NotificationDto getNotificationById(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        return convertToDto(notification);
    }

    @Override
    public List<NotificationDto> getNotificationsByUser(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getUnreadNotificationsByUser(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }

    @Override
    public NotificationDto markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        
        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return convertToDto(updatedNotification);
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);
        
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void deleteNotification(String id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification", "id", id);
        }
        notificationRepository.deleteById(id);
    }

    // Helper methods for DTO conversion
    private Notification convertToEntity(NotificationDto dto) {
        Notification entity = new Notification();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    private NotificationDto convertToDto(Notification entity) {
        NotificationDto dto = new NotificationDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
} 