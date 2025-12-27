package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRoomStatusCommand {
    private Long roomId;
    private RoomStatus newStatus;
}
