package com.hotelsystem.user_service.service;

import com.hotelsystem.user_service.model.User;
import com.hotelsystem.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public List<User> searchUsers(String query) {
        // Simple search implementation
        return userRepository.findAll().stream()
                .filter(user -> user.getName().toLowerCase().contains(query.toLowerCase()) ||
                        user.getEmail().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }

    public String login(String username, String password) {
        // Find user by name (treating name as username)
        User user = userRepository.findAll().stream()
                .filter(u -> u.getName().equalsIgnoreCase(username))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        // Return a mock token for now
        return "mock-jwt-token-" + user.getId();
    }

    public com.hotelsystem.user_service.model.Client createGuest(com.hotelsystem.user_service.model.Client client) {
        client.setRole("GUEST");
        return userRepository.save(client);
    }

    public com.hotelsystem.user_service.model.Client updateGuest(String id,
            com.hotelsystem.user_service.model.Client clientDetails) {
        User user = getUserById(id);
        if (user instanceof com.hotelsystem.user_service.model.Client existingClient) {
            existingClient.setName(clientDetails.getName());
            existingClient.setEmail(clientDetails.getEmail());
            if (clientDetails.getPhone() != null) {
                existingClient.setPhone(clientDetails.getPhone());
            }
            if (clientDetails.getPassword() != null && !clientDetails.getPassword().isEmpty()) {
                existingClient.setPassword(clientDetails.getPassword());
            }
            if (clientDetails.getGender() != null) {
                existingClient.setGender(clientDetails.getGender());
            }
            if (clientDetails.getNationality() != null) {
                existingClient.setNationality(clientDetails.getNationality());
            }
            if (clientDetails.getIdentityDocument() != null) {
                existingClient.setIdentityDocument(clientDetails.getIdentityDocument());
            }
            return userRepository.save(existingClient);
        } else {
            throw new RuntimeException("User with ID " + id + " is not a guest/client.");
        }
    }
    public void deleteUser(String id) {
        if (!userRepository.existsById(Long.parseLong(id))) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(Long.parseLong(id));
    }
}
