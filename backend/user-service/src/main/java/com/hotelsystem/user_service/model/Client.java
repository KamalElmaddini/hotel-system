package com.hotelsystem.user_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "clients")
public class Client extends User {

    private String phone;

    private String address;

    private String gender;

    private String nationality;

    private String identityDocument;

    // Relations to Reservation would technically be cross-service (Bookings are in Booking Service).
    // So we don't map List<Reservation> here directly with JPA unless we are in a monolith.
    // We keep it loosely coupled via ID references if needed, or omit for now.
}
