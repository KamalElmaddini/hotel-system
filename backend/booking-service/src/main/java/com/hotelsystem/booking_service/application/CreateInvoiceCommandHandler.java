package com.hotelsystem.booking_service.application;

import com.hotelsystem.booking_service.model.Booking;
import com.hotelsystem.booking_service.model.Invoice;
import com.hotelsystem.booking_service.repository.BookingRepository;
import com.hotelsystem.booking_service.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CreateInvoiceCommandHandler {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public Long handle(CreateInvoiceCommand command) {
        Booking booking = bookingRepository.findById(command.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + command.getBookingId()));

        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setIssueDate(LocalDateTime.now());
        
        // Simple amount calculation logic: Total Price from Booking
        // In a real system, we might recalculate or add extra services
        invoice.setAmount(booking.getTotalPrice()); 

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return savedInvoice.getId();
    }
}
