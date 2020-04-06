//package com.github.kamilcinner.scheduler2.backend;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//
//@Controller
//@RequestMapping(path="/users")
//public class UserController {
//    @Autowired
//    private UserRepository userRepository;
//
//    @PostMapping(path="/add")
//    @ResponseBody
//    public String addNewUser (@RequestParam String name,
//                                            @RequestParam String email) {
//        User n = new User();
//        n.setName(name);
//        n.setEmail(email);
//        userRepository.save(n);
//        return "Saved";
//    }
//
//    @GetMapping(path="/all")
//    @ResponseBody
//    public Iterable<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//}
