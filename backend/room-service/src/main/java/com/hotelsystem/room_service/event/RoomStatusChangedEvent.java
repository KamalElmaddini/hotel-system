package com.hotelsystem.room_service.event;

import com.hotelsystem.room_service.model.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomStatusChangedEvent {
    private Long roomId;
    private RoomStatus oldStatus;
    private RoomStatus newStatus;
    private LocalDateTime timestamp;
}
