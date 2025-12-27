package com.hotelsystem.user_service.controller;

import com.hotelsystem.user_service.dto.AuthRequest;
import com.hotelsystem.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        try {
            String token = userService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth Service is reachable!");
    }
}
