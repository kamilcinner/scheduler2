package com.github.kamilcinner.scheduler2.backend.repositories;

import com.github.kamilcinner.scheduler2.backend.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete
public interface UserRepository extends CrudRepository<User, Long> {
    List<User> findByUsername(String username);

    User findById(long id);
}
