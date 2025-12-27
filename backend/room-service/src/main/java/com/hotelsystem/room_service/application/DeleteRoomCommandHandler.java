package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteRoomCommandHandler {

    private final RoomRepository roomRepository;

    @Transactional
    public void handle(DeleteRoomCommand command) {
        if (!roomRepository.existsById(command.getId())) {
            throw new RuntimeException("Room not found with ID: " + command.getId());
        }
        roomRepository.deleteById(command.getId());
    }
}
