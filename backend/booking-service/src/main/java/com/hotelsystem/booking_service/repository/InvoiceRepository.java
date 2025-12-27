package com.hotelsystem.booking_service.repository;

import com.hotelsystem.booking_service.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByBookingId(Long bookingId);
}
