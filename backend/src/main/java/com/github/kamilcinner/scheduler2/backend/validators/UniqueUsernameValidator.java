//package com.github.kamilcinner.scheduler2.backend.validators;
//
//import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
//import org.springframework.beans.factory.annotation.Autowire;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Configurable;
//import org.springframework.stereotype.Component;
//
//import javax.validation.ConstraintValidator;
//import javax.validation.ConstraintValidatorContext;
//
//public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {
//
//    @Autowired
//    private UserRepository repository;
//
////    public UniqueUsernameValidator(UserRepository userRepository) {
////        this.repository = userRepository;
////    }
//
//    @Override
//    public void initialize(UniqueUsername constraint) {
//    }
//
//    @Override
//    public boolean isValid(String username, ConstraintValidatorContext context) {
//        return username != null && !repository.existsById(username);
//    }
//}
