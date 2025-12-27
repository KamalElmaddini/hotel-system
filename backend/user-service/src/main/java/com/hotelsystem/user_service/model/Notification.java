package com.hotelsystem.user_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    private Long id;
    private String text;
    private String type; // success, info, warning, error
    private String time;
}
