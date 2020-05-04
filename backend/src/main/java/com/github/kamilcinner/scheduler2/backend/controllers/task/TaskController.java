package com.github.kamilcinner.scheduler2.backend.controllers.task;

import com.github.kamilcinner.scheduler2.backend.controllers.user.CurrentUserUsername;
import com.github.kamilcinner.scheduler2.backend.models.Task;
import com.github.kamilcinner.scheduler2.backend.repositories.TaskRepository;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.List;
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

    // Aggregate root.

    @GetMapping("/tasks")
    CollectionModel<?> all() {
        List<EntityModel<Task>> tasks = taskRepository.findByOwnerUsername(CurrentUserUsername.get(),
                Sort.by(Sort.Direction.ASC, "done", "dueDateTime", "priority")).stream()
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

    // Single item.

    // Get Task by id.
    // Can be accessed always by Task owner.
    // Can be accessed by other users only if Task is shared.
    @GetMapping("/tasks/{id}")
    EntityModel<Task> one(@PathVariable UUID id) {

        Task task = taskRepository.findById(id)
                .map(searchedTask -> {
                    if (!searchedTask.getOwnerUsername().equals(CurrentUserUsername.get()) && !searchedTask.isShared()) {
                        throw new TaskNotFoundException(id);
                    }
                    return searchedTask;
                })
                .orElseThrow(() -> new TaskNotFoundException(id));

        return assembler.toModel(task);
    }

    // Negate Task shared attribute.
    @GetMapping("/tasks/share/{id}")
    ResponseEntity<?> share(@PathVariable UUID id) {

        taskRepository.findById(id)
                .map(taskToUpdate -> {
                    if (!taskToUpdate.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new TaskNotFoundException(id);
                    }
                    taskToUpdate.setShared(!taskToUpdate.isShared());

                    return taskRepository.save(taskToUpdate);
                })
                .orElseThrow(() -> new TaskNotFoundException(id));

        return ResponseEntity.noContent().build();
    }

    // Negate Task done attribute.
    @GetMapping("/tasks/mark/{id}")
    ResponseEntity<?> mark(@PathVariable UUID id) {

        taskRepository.findById(id)
                .map(taskToUpdate -> {
                    if (!taskToUpdate.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new TaskNotFoundException(id);
                    }
                    taskToUpdate.setDone(!taskToUpdate.isDone());

                    return taskRepository.save(taskToUpdate);
                })
                .orElseThrow(() -> new TaskNotFoundException(id));

        return ResponseEntity.noContent().build();
    }

    // Get shared Task by id.
    // Endpoint for anonymous users.
    @GetMapping("/tasks/shared/{id}")
    EntityModel<Task> shared(@PathVariable UUID id) {

        Task task = taskRepository.findById(id)
                .map(searchedTask -> {
                    if (!searchedTask.isShared()) {
                        throw new TaskNotFoundException(id);
                    }
                    return searchedTask;
                })
                .orElseThrow(() -> new TaskNotFoundException(id));

        return assembler.toModel(task);
    }

    // Update existing Task.
    @PutMapping("/tasks/{id}")
    ResponseEntity<?> replaceTask(@Valid @RequestBody Task newTask, @PathVariable UUID id) throws URISyntaxException {

        Task updatedTask = taskRepository.findById(id)
                .map(task -> {
                    if (!task.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new TaskNotFoundException(id);
                    }

                    task.setName(newTask.getName());
                    task.setDueDateTime(newTask.getDueDateTime());
                    task.setDescription(newTask.getDescription());
                    task.setPriority(newTask.getPriority());

                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new TaskNotFoundException(id));

        EntityModel<Task> entityModel = assembler.toModel(updatedTask);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Delete existing Task.
    @DeleteMapping("/tasks/{id}")
    ResponseEntity<?> deleteTask(@PathVariable UUID id) {

        taskRepository.findById(id)
                .map(taskToDelete -> {
                    if (!taskToDelete.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new TaskNotFoundException(id);
                    }

                    return taskToDelete;
                })
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
