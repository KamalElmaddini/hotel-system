package com.hotelsystem.booking_service.controller;

import com.hotelsystem.booking_service.application.CreateBookingCommand;
import com.hotelsystem.booking_service.application.CreateBookingCommandHandler;
import com.hotelsystem.booking_service.application.DeleteBookingCommandHandler;
import com.hotelsystem.booking_service.application.GetBookingQuery;
import com.hotelsystem.booking_service.application.GetBookingQueryHandler;
import com.hotelsystem.booking_service.application.GetBookingsQuery;
import com.hotelsystem.booking_service.application.GetBookingsQueryHandler;
import com.hotelsystem.booking_service.application.UpdateBookingCommand;
import com.hotelsystem.booking_service.application.UpdateBookingCommandHandler;
import com.hotelsystem.booking_service.model.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final CreateBookingCommandHandler createBookingCommandHandler;
    private final GetBookingQueryHandler getBookingQueryHandler;
    private final GetBookingsQueryHandler getBookingsQueryHandler;
    private final UpdateBookingCommandHandler updateBookingCommandHandler;
    private final DeleteBookingCommandHandler deleteBookingCommandHandler;

    @PostMapping
    public ResponseEntity<Long> createBooking(@RequestBody CreateBookingCommand command) {
        Long bookingId = createBookingCommandHandler.handle(command);
        return ResponseEntity.ok(bookingId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBooking(@PathVariable Long id, @RequestBody UpdateBookingCommand command) {
        command.setBookingId(id);
        updateBookingCommandHandler.handle(command);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        deleteBookingCommandHandler.handle(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(@RequestParam(required = false) String guestId) {
        GetBookingsQuery query = new GetBookingsQuery();
        query.setGuestId(guestId);
        List<Booking> bookings = getBookingsQueryHandler.handle(query);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        Booking booking = getBookingQueryHandler.handle(new GetBookingQuery(id));
        return ResponseEntity.ok(booking);
    }
}
