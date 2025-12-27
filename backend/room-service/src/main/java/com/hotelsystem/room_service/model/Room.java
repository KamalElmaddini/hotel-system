package com.hotelsystem.room_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    @Column(nullable = false)
    private BigDecimal pricePerNight;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @Enumerated(EnumType.STRING)
    private RoomView viewType;

    private Integer maxGuests;

    private Integer bedCount;

    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"), inverseJoinColumns = @JoinColumn(name = "amenity_id"))
    private List<Amenity> amenities;
}
