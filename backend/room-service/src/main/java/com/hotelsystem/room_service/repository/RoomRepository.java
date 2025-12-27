package com.hotelsystem.room_service.repository;

import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.model.RoomStatus;
import com.hotelsystem.room_service.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatusAndType(RoomStatus status, RoomType type);
    List<Room> findByStatus(RoomStatus status);
    java.util.Optional<Room> findByRoomNumber(String roomNumber);
}
