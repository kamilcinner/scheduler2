package com.github.kamilcinner.scheduler2.backend.controllers;

import com.github.kamilcinner.scheduler2.backend.models.Task;
import com.github.kamilcinner.scheduler2.backend.models.User;
import com.github.kamilcinner.scheduler2.backend.repositories.TaskRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
class TaskController {

    private final TaskRepository taskRepository;
    private final TaskModelAssembler assembler;

    TaskController(TaskRepository taskRepository, TaskModelAssembler assembler) {
        this.taskRepository = taskRepository;
        this.assembler = assembler;
    }

    // Aggregate root

    @GetMapping("/tasks")
    CollectionModel all() {
        List<EntityModel<Task>> tasks = taskRepository.findByOwnerUsername(CurrentUserUsername.get()).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(tasks,
                linkTo(methodOn(TaskController.class).all()).withSelfRel());
    }

    @PostMapping("/tasks")
    ResponseEntity<?> newTask(@Valid @RequestBody Task newTask) throws URISyntaxException {
        newTask.setOwnerUsername(CurrentUserUsername.get());

        EntityModel<Task> entityModel = assembler.toModel(taskRepository.save(newTask));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Single item

    @GetMapping("/tasks/{id}")
    EntityModel<Task> one(@PathVariable UUID id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        if (!task.getOwnerUsername().equals(CurrentUserUsername.get())) {
            throw new TaskNotFoundException(id);
        }

        return assembler.toModel(task);
    }

    @PutMapping("/tasks/{id}")
    ResponseEntity<?> replaceTask(@Valid @RequestBody Task newTask, @PathVariable UUID id) throws URISyntaxException {

        Task updatedTask = taskRepository.findById(id)
                .map(task -> {
                    task.setName(newTask.getName());
                    return taskRepository.save(task);
                })
                .orElseGet(() -> {
//                    newTask.setId(id);
                    return taskRepository.save(newTask);
                });

        EntityModel<Task> entityModel = assembler.toModel(updatedTask);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    @DeleteMapping("/tasks/{id}")
    ResponseEntity<?> deleteTask(@PathVariable UUID id) {

        taskRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
