package com.hotelsystem.room_service.bootstrap;

import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.model.RoomStatus;
import com.hotelsystem.room_service.model.RoomType;
import com.hotelsystem.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class RoomDataSeeder implements CommandLineRunner {

        private final RoomRepository roomRepository;

        @Override
        public void run(String... args) throws Exception {
                if (roomRepository.count() == 0) {
                        Room room1 = new Room();
                        room1.setRoomNumber("101");
                        room1.setType(RoomType.STANDARD);
                        room1.setPricePerNight(new BigDecimal("100.00"));
                        room1.setStatus(RoomStatus.AVAILABLE);
                        room1.setDescription("Standard Single Room");
                        room1.setViewType(com.hotelsystem.room_service.model.RoomView.CITY_VIEW);
                        room1.setMaxGuests(1);
                        room1.setBedCount(1);

                        Room room2 = new Room();
                        room2.setRoomNumber("102");
                        room2.setType(RoomType.SUPERIOR);
                        room2.setPricePerNight(new BigDecimal("150.00"));
                        room2.setStatus(RoomStatus.AVAILABLE);
                        room2.setDescription("Superior Double Room");
                        room2.setViewType(com.hotelsystem.room_service.model.RoomView.GARDEN_VIEW);
                        room2.setMaxGuests(2);
                        room2.setBedCount(1);

                        Room room3 = new Room();
                        room3.setRoomNumber("201");
                        room3.setType(RoomType.SUITE);
                        room3.setPricePerNight(new BigDecimal("300.00"));
                        room3.setStatus(RoomStatus.AVAILABLE);
                        room3.setDescription("Luxury Suite");
                        room3.setViewType(com.hotelsystem.room_service.model.RoomView.SEA_VIEW);
                        room3.setMaxGuests(4);
                        room3.setBedCount(1);

                        Room room4 = new Room();
                        room4.setRoomNumber("202");
                        room4.setType(RoomType.PRESIDENTIAL_SUITE);
                        room4.setPricePerNight(new BigDecimal("1000.00"));
                        room4.setStatus(RoomStatus.MAINTENANCE);
                        room4.setDescription("Presidential Suite with View");
                        room4.setViewType(com.hotelsystem.room_service.model.RoomView.MOUNTAIN_VIEW);
                        room4.setMaxGuests(6);
                        room4.setBedCount(2);

                        roomRepository.saveAll(Arrays.asList(room1, room2, room3, room4));
                        System.out.println("--- Room Data Seeded ---");
                }
        }
}
