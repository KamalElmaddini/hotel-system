package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetRoomQueryHandler {
    private final RoomRepository roomRepository;

    public Room handle(GetRoomQuery query) {
        return roomRepository.findById(query.getId())
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + query.getId()));
    }
}
