package com.hotelsystem.user_service.controller;

import com.hotelsystem.user_service.model.Notification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/users/notifications")
public class NotificationController {

    private final List<Notification> notifications = new java.util.concurrent.CopyOnWriteArrayList<>();

    public NotificationController() {
        // Initial Seed Data
        notifications.add(new Notification(1L, "System initialized ready for demo", "info", "Just now"));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        return ResponseEntity.ok(notifications);
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        notification.setId(System.currentTimeMillis()); // Simple ID generation
        if (notification.getTime() == null) {
            notification.setTime("Just now");
        }
        notifications.add(0, notification); // Add to top
        
        // Keep size manageable
        if (notifications.size() > 20) {
            notifications.remove(notifications.size() - 1);
        }
        
        return ResponseEntity.ok(notification);
    }
}
