package com.hotelsystem.user_service.controller;

import com.hotelsystem.user_service.model.User;
import com.hotelsystem.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String q) {
        return ResponseEntity.ok(userService.searchUsers(q));
    }
    @PostMapping("/guests")
    public ResponseEntity<com.hotelsystem.user_service.model.Client> createGuest(@RequestBody com.hotelsystem.user_service.model.Client client) {
        return ResponseEntity.ok(userService.createGuest(client));
    }

    @PutMapping("/guests/{id}")
    public ResponseEntity<com.hotelsystem.user_service.model.Client> updateGuest(@PathVariable String id, @RequestBody com.hotelsystem.user_service.model.Client client) {
        return ResponseEntity.ok(userService.updateGuest(id, client));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
