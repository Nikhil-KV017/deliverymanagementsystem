package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    @Autowired
    private UserRepository repo;

    @PostConstruct
    public void initUsers() {
        if (repo.count() == 0) {
            repo.saveAll(Arrays.asList(
                new User(null, "System Admin", "admin@foodbuddy.com", "password", "admin", "Mumbai", true),
                new User(null, "Rahul Sharma", "customer@foodbuddy.com", "password", "customer", "Mumbai", true),
                new User(null, "Amit Driver", "agent@foodbuddy.com", "password", "agent", "Mumbai", true)
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<User> userOpt = repo.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("token", "mock-jwt-token-" + user.getId());
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());
            userData.put("city", user.getCity());
            userData.put("onDuty", user.isOnDuty());
            
            response.put("user", userData);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if ("agent".equalsIgnoreCase(user.getRole())) {
            user.setOnDuty(true);
        }
        return repo.save(user);
    }

    @GetMapping
    public java.util.List<User> getAllUsers() {
        return repo.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Optional<User> userOpt = repo.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (payload.containsKey("onDuty")) {
                user.setOnDuty(payload.get("onDuty"));
                repo.save(user);
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
