package com.hotelsystem.api_gateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest authRequest) {
        // Simplified auth check (Hardcoded for MVP)
        if ("admin".equals(authRequest.getUsername()) && "password".equals(authRequest.getPassword())) {
            return jwtUtil.generateToken(authRequest.getUsername());
        }
        if ("guest".equals(authRequest.getUsername()) && "guest".equals(authRequest.getPassword())) {
            return jwtUtil.generateToken(authRequest.getUsername());
        }
        throw new RuntimeException("Invalid access");
    }
}
