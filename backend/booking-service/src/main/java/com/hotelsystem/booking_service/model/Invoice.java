package com.hotelsystem.booking_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime issueDate;

    private BigDecimal amount;

    @OneToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "id")
    private Booking booking;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "invoice_services",
        joinColumns = @JoinColumn(name = "invoice_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<AdditionalService> services;

    public void calculateTotal() {
        // Logic to sum up service prices + booking total
    }
}
