package com.hotelsystem.booking_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guest {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
}
