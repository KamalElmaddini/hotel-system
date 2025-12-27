package com.hotelsystem.room_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomCleanedEvent {
    private Long roomId;
    private String cleanedBy;
    private LocalDateTime timestamp;
}
