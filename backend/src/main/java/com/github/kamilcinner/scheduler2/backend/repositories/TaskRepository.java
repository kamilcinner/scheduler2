package com.github.kamilcinner.scheduler2.backend.repositories;

import com.github.kamilcinner.scheduler2.backend.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByOwnerUsername(String username);
}
