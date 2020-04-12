package com.github.kamilcinner.scheduler2.backend.controllers;

import com.github.kamilcinner.scheduler2.backend.models.User;
import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class UserController {
    private final UserRepository repository;

    UserController(UserRepository repository) {
        this.repository = repository;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register User
    @PostMapping("/users")
    ResponseEntity<String> addUser(@Valid @RequestBody User user) {
        // Check if the username is available.
        if (repository.existsById(user.getUsername())) {
            return ResponseEntity.status(400).body("The given login is already in use");
        }

        // Encode password and add User to database.
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);

        return ResponseEntity.ok("User has been created");
    }
}
