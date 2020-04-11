//package com.github.kamilcinner.scheduler2.backend.controllers;
//
//import com.github.kamilcinner.scheduler2.backend.models.User;
//import org.springframework.hateoas.EntityModel;
//import org.springframework.hateoas.server.RepresentationModelAssembler;
//import org.springframework.stereotype.Component;
//
//import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
//import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
//
//@Component
//class UserModelAssembler implements RepresentationModelAssembler<User, EntityModel<User>> {
//
//    @Override
//    public EntityModel<User> toModel(User user) {
//
//        return new EntityModel<>(user,
//                linkTo(methodOn(UserController.class).one(user.getId())).withSelfRel(),
//                linkTo(methodOn(UserController.class).all(null)).withRel("users"));
//    }
//}