package com.hotelsystem.room_service.controller;

import com.hotelsystem.room_service.application.GetAvailableRoomsQuery;
import com.hotelsystem.room_service.application.GetAvailableRoomsQueryHandler;
import com.hotelsystem.room_service.application.UpdateRoomStatusCommand;
import com.hotelsystem.room_service.application.UpdateRoomStatusCommandHandler;
import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.model.RoomType;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final GetAvailableRoomsQueryHandler getAvailableRoomsQueryHandler;
    private final UpdateRoomStatusCommandHandler updateRoomStatusCommandHandler;
    private final com.hotelsystem.room_service.application.CreateRoomCommandHandler createRoomCommandHandler;
    private final com.hotelsystem.room_service.application.UpdateRoomCommandHandler updateRoomCommandHandler;
    private final com.hotelsystem.room_service.application.DeleteRoomCommandHandler deleteRoomCommandHandler;
    private final com.hotelsystem.room_service.application.GetRoomQueryHandler getRoomQueryHandler;

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {
        Room room = getRoomQueryHandler.handle(new com.hotelsystem.room_service.application.GetRoomQuery(id));
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        deleteRoomCommandHandler.handle(new com.hotelsystem.room_service.application.DeleteRoomCommand(id));
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAvailableRooms(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(required = false) RoomType type,
            @RequestParam(required = false) com.hotelsystem.room_service.model.RoomStatus status,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) com.hotelsystem.room_service.model.RoomView viewType,
            @RequestParam(required = false) Integer maxGuests,
            @RequestParam(required = false) Integer bedCount) {

        GetAvailableRoomsQuery query = new GetAvailableRoomsQuery(checkInDate, checkOutDate, type, status, minPrice,
                maxPrice, viewType, maxGuests, bedCount);
        List<Room> rooms = getAvailableRoomsQueryHandler.handle(query);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping
    public ResponseEntity<Long> createRoom(
            @RequestBody com.hotelsystem.room_service.application.CreateRoomCommand command) {
        return ResponseEntity.ok(createRoomCommandHandler.handle(command));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateRoomStatus(@PathVariable Long id, @RequestBody UpdateRoomStatusCommand command) {
        // Ensure command ID matches path ID for safety
        command.setRoomId(id);
        updateRoomStatusCommandHandler.handle(command);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateRoom(@PathVariable Long id,
            @RequestBody com.hotelsystem.room_service.application.UpdateRoomCommand command) {
        command.setId(id);
        updateRoomCommandHandler.handle(command);
        return ResponseEntity.ok().build();
    }
}
