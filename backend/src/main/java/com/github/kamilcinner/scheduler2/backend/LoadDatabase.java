package com.github.kamilcinner.scheduler2.backend;

import com.github.kamilcinner.scheduler2.backend.models.Task;
import com.github.kamilcinner.scheduler2.backend.repositories.TaskRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
class LoadDatabase {

    @Bean
    CommandLineRunner initDatabase(TaskRepository repository) {
        return args -> {
            log.info("Preloading " + repository.save(new Task("Do shopping")));
            log.info("Preloading " + repository.save(new Task("Clean house")));
        };
    }
}
