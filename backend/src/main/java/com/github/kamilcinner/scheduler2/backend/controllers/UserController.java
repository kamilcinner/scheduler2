package com.github.kamilcinner.scheduler2.backend.controllers;

import com.github.kamilcinner.scheduler2.backend.models.User;
import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
import jdk.nashorn.internal.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

class Message {
    private String message;

    Message(String message) {
        this.message = message;
    }
}

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
//            return ResponseEntity.badRequest().body("{ok: false, errors: \"blabla\", timestamp: \"2020-04-15T18:57:32.834+0000\", status: 400, error: \"Bad Request\", message: \"The given login is already in use\"}");
            return ResponseEntity.badRequest().body("{\"message\":\"The given login is already in use\"}");
//            return ResponseEntity.badRequest().body("{\"status\":400,\"error\":\"Bad Request\",\"message\":\"Validation failed for object='user'. Error count: 1\"}");
        }

        // Encode password and add User to database.
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);

        return ResponseEntity.ok("User has been created");
    }
}
