package com.github.kamilcinner.scheduler2.backend.tasks.repositories;

import com.github.kamilcinner.scheduler2.backend.tasks.models.Task;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByOwnerUsername(String username, Sort sort);
}
