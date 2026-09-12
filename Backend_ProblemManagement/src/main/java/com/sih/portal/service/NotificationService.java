package com.sih.portal.service;

import com.sih.portal.entity.Notification;
import com.sih.portal.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }

    public Notification getNotificationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public Notification createNotification(Notification notification) {
        return repository.save(notification);
    }

    public Notification updateNotification(Long id, Notification updatedNotification) {
        Notification existing = getNotificationById(id);

        existing.setUser(updatedNotification.getUser());
        existing.setTitle(updatedNotification.getTitle());
        existing.setMessage(updatedNotification.getMessage());
        existing.setTargetScreen(updatedNotification.getTargetScreen());
        existing.setReferenceId(updatedNotification.getReferenceId());
        existing.setIsRead(updatedNotification.getIsRead());

        return repository.save(existing);
    }

    public void deleteNotification(Long id) {
        repository.deleteById(id);
    }
}