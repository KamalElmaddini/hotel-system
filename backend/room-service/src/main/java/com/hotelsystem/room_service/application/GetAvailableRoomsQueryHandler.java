package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.model.RoomStatus;
import com.hotelsystem.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAvailableRoomsQueryHandler {

    private final RoomRepository roomRepository;

    @Transactional(readOnly = true)
    public List<Room> handle(GetAvailableRoomsQuery query) {
        // Fetch all rooms (in a real app, use dynamic query/Specification)
        List<Room> allRooms = roomRepository.findAll();

        return allRooms.stream()
                .filter(room -> {
                    // Filter by Type
                    if (query.getType() != null && !room.getType().equals(query.getType())) {
                        return false;
                    }
                    // Filter by Status
                    if (query.getStatus() != null && !room.getStatus().equals(query.getStatus())) {
                        return false;
                    }
                    // Filter by Min Price
                    if (query.getMinPrice() != null && room.getPricePerNight()
                            .compareTo(java.math.BigDecimal.valueOf(query.getMinPrice())) < 0) {
                        return false;
                    }
                    // Filter by Max Price
                    if (query.getMaxPrice() != null && room.getPricePerNight()
                            .compareTo(java.math.BigDecimal.valueOf(query.getMaxPrice())) > 0) {
                        return false;
                    }
                    // Filter by View Type
                    if (query.getViewType() != null && !room.getViewType().equals(query.getViewType())) {
                        return false;
                    }
                    // Filter by Max Guests (>=)
                    if (query.getMaxGuests() != null && room.getMaxGuests() < query.getMaxGuests()) {
                        return false;
                    }
                    // Filter by Bed Count (>=)
                    if (query.getBedCount() != null && room.getBedCount() < query.getBedCount()) {
                        return false;
                    }
                    return true;
                })
                .toList();
    }
}
