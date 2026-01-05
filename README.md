# 🏨 Grandeur Hotel Management System

> A modern, full-stack microservices application for managing luxury hotel operations, built with **Spring Boot** and **React**.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Overview

**Grandeur Hotel Management System** is a comprehensive solution designed to digitize and automate the day-to-day operations of a premium hotel. From managing room availability and processing reservations to handling guest profiles and billing, this system provides a seamless experience for hotel administrators and staff.

Built on a robust **Microservices Architecture**, it ensures scalability, maintainability, and distinct separation of concerns between User Management, Room Inventory, and Booking logic.

## ✨ Key Features

*   **📊 Interactive Dashboard**: Real-time insights into revenue, occupancy rates, and daily arrivals with 7-day forecasting.
*   **🛏️ Room Management**: Complete inventory control with status tracking (Available, Occupied, Maintenance) and advanced filtering.
*   **📅 Smart Reservation Wizard**: A streamlined multi-step process to check availability, select rooms, and book stays in seconds.
*   **👥 Guest Directory**: Centralized profile management including identity documents and stay history.
*   **🔐 Secure Authentication**: JWT-based security with role-based access control.
*   **🧾 Automated Billing**: Instant invoice generation and total calculation logic.

## 🛠️ Tech Stack

### Backend (Microservices)
*   **Java 17** & **Spring Boot 3**
*   **Spring Cloud Gateway** (API Gateway)
*   **Spring Data JPA** (Hibernate)
*   **H2 Database** (In-memory for rapid development)
*   **Maven** (Build Tool)

### Frontend
*   **React 18**
*   **TypeScript**
*   **Tailwind CSS** (Styling)
*   **Vite** (Build Tool)
*   **Recharts** (Data Visualization)
*   **Lucide React** (Icons)

## 🏗️ Architecture

The system is divided into four main services:

1.  **API Gateway** (`Port 10000`): The entry point that routes requests to appropriate services.
2.  **User Service** (`Port 10001`): Handles auth, admin profiles, and guest data.
3.  **Booking Service** (`Port 10002`): Manages reservations and invoicing.
4.  **Room Service** (`Port 10004`): Manages room types, amenities, and status.

## 🚀 Getting Started

### Prerequisites
*   **Java 17** (JDK)
*   **Node.js** (v18+)
*   **Maven** (Optional, wrapper included)

### Quick Start (Windows)
We have provided a unified startup script to launch the entire ecosystem.

1.  Clone the repository:
    ```bash
    git clone https://github.com/KamalElmaddini/hotel-system.git
    cd hotel-system
    ```

2.  Run the automated launcher:
    ```cmd
    .\start-local.bat
    ```

    *This script will compile all backend services, install frontend dependencies, and launch 5 separate operational windows.*

3.  Access the application:
    *   **Frontend**: [http://localhost:5173](http://localhost:5173)
    *   **API Gateway**: [http://localhost:10000](http://localhost:10000)

### Default Credentials
*   **Admin Email**: `admin@grandeur.com`
*   **Password**: `password`

## 📸 Screenshots

![Hotel Management System](./public/Screenshot1.png)

## 🤝 Contribution
Contributions are welcome! Please fork the repository and submit a pull request.


---

© 2025 [Kamal Elmaddini](https://github.com/KamalElmaddini). All Rights Reserved.


## 📄 License
This project is licensed under the MIT License.
