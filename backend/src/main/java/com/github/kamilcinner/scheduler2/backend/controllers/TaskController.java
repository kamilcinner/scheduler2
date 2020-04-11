package com.github.kamilcinner.scheduler2.backend.controllers;

import com.github.kamilcinner.scheduler2.backend.models.Task;
import com.github.kamilcinner.scheduler2.backend.repositories.TaskRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
class TaskController {

    private final TaskRepository repository;
    private final TaskModelAssembler assembler;

    TaskController(TaskRepository repository, TaskModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    // Aggregate root

    @GetMapping("/tasks")
    CollectionModel all() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = null;
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            currentUserName = authentication.getName();
        }

        List<EntityModel<Task>> tasks = repository.findByOwnerUsername(currentUserName).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(tasks,
                linkTo(methodOn(TaskController.class).all()).withSelfRel());
    }

    @PostMapping("/tasks")
    ResponseEntity<?> newTask(@RequestBody Task newTask) throws URISyntaxException {

        EntityModel<Task> entityModel = assembler.toModel(repository.save(newTask));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Single item

    @GetMapping("/tasks/{id}")
    EntityModel<Task> one(@PathVariable UUID id) {

        Task task = repository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        return assembler.toModel(task);
    }

    @PutMapping("/tasks/{id}")
    ResponseEntity<?> replaceTask(@RequestBody Task newTask, @PathVariable UUID id) throws URISyntaxException {

        Task updatedTask = repository.findById(id)
                .map(task -> {
                    task.setName(newTask.getName());
                    return repository.save(task);
                })
                .orElseGet(() -> {
//                    newTask.setId(id);
                    return repository.save(newTask);
                });

        EntityModel<Task> entityModel = assembler.toModel(updatedTask);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    @DeleteMapping("/tasks/{id}")
    ResponseEntity<?> deleteTask(@PathVariable UUID id) {

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
