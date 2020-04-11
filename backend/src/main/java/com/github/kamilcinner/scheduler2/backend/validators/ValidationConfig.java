//package com.github.kamilcinner.scheduler2.backend.validators;
//
//import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class ValidationConfig {
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Bean
//    public UniqueUsernameValidator uniqueUsernameValidator() {
//        return new UniqueUsernameValidator(userRepository);
//    }
//}
