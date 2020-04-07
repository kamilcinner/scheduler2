package com.github.kamilcinner.scheduler2.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/users")
//@CrossOrigin(origins="http://localhost:4200", maxAge=3600)
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping(path="/add")
    public String addNewUser (@RequestParam String name,
                              @RequestParam String email) {
        User n = new User(name, email);
        userRepository.save(n);
        return "Saved";
    }

    @GetMapping(path="/all")
//    public ArrayList<Map<String, Object>> getAllUsers() {
    public Iterable<User> getAllUsers() {
        // Add some users for test.
        userRepository.save(new User("Kamil", "email@kamil.com"));
        userRepository.save(new User("Magdalena", "email@magda.com"));
        userRepository.save(new User("Kornelia", "email@kornelia.com"));

//        ArrayList<Map<String, Object>> mapArrayList = new ArrayList<>();
//
//        Map<String, Object> model;
//        for (User u : userRepository.findAll()) {
//            model = new HashMap<>();
//            model.put("id", u.getId().toString());
//            model.put("name", u.getName());
//            model.put("email", u.getEmail());
//
//            mapArrayList.add(model);
//        }
//        return mapArrayList;
        return userRepository.findAll();
    }
}
