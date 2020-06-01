package com.github.kamilcinner.scheduler2.backend;

import com.github.kamilcinner.scheduler2.backend.activities.models.Activity;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListItemRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListRepository;
import com.github.kamilcinner.scheduler2.backend.tasks.models.Task;
import com.github.kamilcinner.scheduler2.backend.users.models.User;
import com.github.kamilcinner.scheduler2.backend.activities.repositories.ActivityRepository;
import com.github.kamilcinner.scheduler2.backend.tasks.repositories.TaskRepository;
import com.github.kamilcinner.scheduler2.backend.users.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Configuration
@Slf4j
class PopulateDatabaseByDummies {

    @Bean
    CommandLineRunner initDatabase(TaskRepository taskRepository,
                                   ActivityRepository activityRepository,
                                   ShoppingListRepository shoppingListRepository,
                                   ShoppingListItemRepository shoppingListItemRepository,
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // Add Tasks.

            log.info("Preloading " + taskRepository.save(new Task("user1", "Do shopping",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("user1", "Do shopping",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("user1", "Do shopping",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("user1", "Do shopping",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("user1", "Do shopping",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("user1", "Do shopping",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));

            log.info("Preloading " + taskRepository.save(new Task("user1", "Do shopping",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("user1", "Clean house",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", false, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("testowo", "Gogogo VP!",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", true, false, 'h')));
            log.info("Preloading " + taskRepository.save(new Task("testowo", "Hakuna Matata!!!",
                    Timestamp.valueOf("2020-4-12 17:00:00"), "That's my super task", false, false, 'h')));

            // Add Users.

            log.info("Preloading " + userRepository.save(new User("user1", passwordEncoder.encode("pass"),
                    "user@gmail.com", true, "ROLE_USER")));
            log.info("Preloading " + userRepository.save(new User("testowo", passwordEncoder.encode("pass"),
                    "testowo@gmail.com", true, "ROLE_USER")));
            log.info("Preloading " + userRepository.save(new User("kamil", passwordEncoder.encode("pass"),
                    "kamil@gmail.com", true, "ROLE_USER")));

            // Add Activities.

            log.info("Preloading " + activityRepository.save(new Activity("user1", "System Programming Lectures",
                    "I like to roll", Time.valueOf("12:31:00"), Time.valueOf("14:31:00"), Date.valueOf("2020-05-05"),
                    true, true)));
            log.info("Preloading " + activityRepository.save(new Activity("user1", "PE Lectures",
                    "I like to roll", Time.valueOf("12:31:00"), Time.valueOf("14:31:00"), Date.valueOf("2020-05-05"),
                    true, true)));
            log.info("Preloading " + activityRepository.save(new Activity("user1", "AI Lectures",
                    "I like to roll", Time.valueOf("12:31:00"), Time.valueOf("14:31:00"), Date.valueOf("2020-05-05"),
                    true, true)));

            // Add Shopping List with Items.

            shoppingListRepository.save(new ShoppingList("user1", "Test SL"));

            shoppingListItemRepository.save(new ShoppingListItem(shoppingListRepository.findByOwnerUsername("user1", Sort.by(Sort.Direction.ASC, "lastEditDateTime")).get(0), "Test Item 1"));
            shoppingListItemRepository.save(new ShoppingListItem(shoppingListRepository.findByOwnerUsername("user1", Sort.by(Sort.Direction.ASC, "lastEditDateTime")).get(0), "Test Item 2"));
            shoppingListItemRepository.save(new ShoppingListItem(shoppingListRepository.findByOwnerUsername("user1", Sort.by(Sort.Direction.ASC, "lastEditDateTime")).get(0), "Test Item 3"));
        };
    }
}
