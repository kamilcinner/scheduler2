package com.github.kamilcinner.scheduler2.backend;

import com.github.kamilcinner.scheduler2.backend.repositories.TaskRepository;
import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackageClasses = {UserRepository.class, TaskRepository.class})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
