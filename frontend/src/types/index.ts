export interface AuthRequest {
    username?: string;
    password?: string;
}

export interface Amenity {
    id: number;
    name: string;
    description: string;
}

export interface Room {
    id: number;
    roomNumber: string;
    type: 'STANDARD' | 'SUPERIOR' | 'DELUXE' | 'SUITE' | 'FAMILY' | 'ACCESSIBLE' | 'CONNECTING' | 'PRESIDENTIAL_SUITE';
    pricePerNight: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
    viewType: 'CITY_VIEW' | 'SEA_VIEW' | 'GARDEN_VIEW' | 'POOL_VIEW' | 'MOUNTAIN_VIEW' | 'NO_VIEW';
    maxGuests: number;
    bedType: 'KING' | 'QUEEN' | 'DOUBLE' | 'TWIN' | 'SINGLE';
    bedCount: number;
    description: string;
    imageUrl?: string;
    amenities: Amenity[];
}

export interface Booking {
    id: number;
    roomId: number;
    guestId: string;
    checkInDate: string; // ISO Date string
    checkOutDate: string; // ISO Date string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT';
    totalPrice: number;
    createdAt: string;
}

export interface CreateBookingCommand {
    guestId: string;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
}

export interface User {
    id: string;
    username?: string; // keeping for backward compat if needed, but 'name' is primary
    name: string;
    email: string;
    role: string;
    phone?: string;
    gender?: string;
    nationality?: string;
    identityDocument?: string;
    password?: string;
}
