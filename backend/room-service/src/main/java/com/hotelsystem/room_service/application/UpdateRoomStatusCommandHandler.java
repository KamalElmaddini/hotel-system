package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateRoomStatusCommandHandler {

    private final RoomRepository roomRepository;

    @Transactional
    public void handle(UpdateRoomStatusCommand command) {
        Room room = roomRepository.findById(command.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        // Capture old status for event (omitted here)
        // RoomStatus oldStatus = room.getStatus();
        
        room.setStatus(command.getNewStatus());
        roomRepository.save(room);
        
        // Publish RoomStatusChangedEvent (omitted)
    }
}
