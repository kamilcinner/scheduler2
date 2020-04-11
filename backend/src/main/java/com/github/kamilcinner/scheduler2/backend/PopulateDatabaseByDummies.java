package com.github.kamilcinner.scheduler2.backend;

import com.github.kamilcinner.scheduler2.backend.models.Task;
import com.github.kamilcinner.scheduler2.backend.models.User;
import com.github.kamilcinner.scheduler2.backend.repositories.TaskRepository;
import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
class PopulateDatabaseByDummies {

    @Bean
    CommandLineRunner initDatabase(TaskRepository taskRepository, UserRepository userRepository) {
        return args -> {
            log.info("Preloading " + taskRepository.save(new Task("user", "Do shopping")));
            log.info("Preloading " + taskRepository.save(new Task("user", "Clean house")));
            log.info("Preloading " + taskRepository.save(new Task("testowo", "Gogogo VP!")));
            log.info("Preloading " + taskRepository.save(new Task("testowo", "Hakuna Matata!!!")));

            log.info("Preloading " + userRepository.save(new User("user", "{noop}pass", true, "ROLE_USER")));
            log.info("Preloading " + userRepository.save(new User("testowo", "{noop}pass", true, "ROLE_USER")));
            log.info("Preloading " + userRepository.save(new User("kamil", "{noop}pass", true, "ROLE_USER")));
        };
    }
}
