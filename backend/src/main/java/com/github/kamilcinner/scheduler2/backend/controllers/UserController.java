package com.github.kamilcinner.scheduler2.backend.controllers;

import com.github.kamilcinner.scheduler2.backend.models.User;
import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping()
    public Iterable<User> getAllUsers() {
        // Add some users for test.
        userRepository.save(new User("Kamil", "email@kamil.com"));
        userRepository.save(new User("Magdalena", "email@magda.com"));
        userRepository.save(new User("Kornelia", "email@kornelia.com"));

        return userRepository.findAll();
    }
}
