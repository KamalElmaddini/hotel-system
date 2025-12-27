package com.hotelsystem.booking_service.controller;

import com.hotelsystem.booking_service.application.CreateInvoiceCommand;
import com.hotelsystem.booking_service.application.CreateInvoiceCommandHandler;
import com.hotelsystem.booking_service.model.Invoice;
import com.hotelsystem.booking_service.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final CreateInvoiceCommandHandler createInvoiceCommandHandler;
    private final InvoiceRepository invoiceRepository;

    @PostMapping
    public ResponseEntity<Long> createInvoice(@RequestBody CreateInvoiceCommand command) {
        Long invoiceId = createInvoiceCommandHandler.handle(command);
        return ResponseEntity.ok(invoiceId);
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }
}
