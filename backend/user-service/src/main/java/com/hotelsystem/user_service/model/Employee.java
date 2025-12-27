package com.hotelsystem.user_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "employees")
public class Employee extends User {

    private String employeeId; // Matricule

    private LocalDate hireDate;

    private Double salary;
}
