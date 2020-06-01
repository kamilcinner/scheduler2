package com.github.kamilcinner.scheduler2.backend.tasks.controllers;

import com.github.kamilcinner.scheduler2.backend.tasks.controllers.helpers.TaskFinder;
import com.github.kamilcinner.scheduler2.backend.tasks.controllers.helpers.TaskModelAssembler;
import com.github.kamilcinner.scheduler2.backend.tasks.models.Task;
import com.github.kamilcinner.scheduler2.backend.tasks.repositories.TaskRepository;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class TaskController {

    private final TaskRepository taskRepository;
    private final TaskModelAssembler assembler;

    TaskController(TaskRepository taskRepository, TaskModelAssembler assembler) {

        this.taskRepository = taskRepository;
        this.assembler = assembler;
    }

    // Get all Tasks.
    @GetMapping("/tasks")
    public CollectionModel<?> all() {

        // Get all Tasks by current user name.
        // Sort them by its done, due date and time, priority attributes.
        // Assemble their models.
        List<EntityModel<Task>> tasks = taskRepository.findByOwnerUsername(CurrentUserUsername.get(),
                Sort.by(Sort.Direction.ASC, "done", "dueDateTime", "priority")).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(tasks,
                linkTo(methodOn(TaskController.class).all()).withSelfRel());
    }

    // Create a new Task.
    @PostMapping("/tasks")
    ResponseEntity<?> newTask(@Valid @RequestBody Task newTask) {

        // Set Task owner.
        newTask.setOwnerUsername(CurrentUserUsername.get());

        EntityModel<Task> entityModel = assembler.toModel(taskRepository.save(newTask));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Get one Task by id.
    // Can be accessed always by Task owner.
    // Can be accessed by other users only if Task is shared.
    @GetMapping("/tasks/{id}")
    public EntityModel<Task> one(@PathVariable UUID id) {

        TaskFinder finder = new TaskFinder(id, taskRepository);

        Task task = finder.get(TaskFinder.Access.OWNER_OR_SHARED);

        return assembler.toModel(task);
    }

    // Negate Task shared attribute.
    @GetMapping("/tasks/{id}/share")
    ResponseEntity<?> share(@PathVariable UUID id) {

        TaskFinder finder = new TaskFinder(id, taskRepository);

        Task task = finder.get(TaskFinder.Access.OWNER);

        // Negate attribute.
        task.setShared(!task.isShared());

        taskRepository.save(task);

        return ResponseEntity.noContent().build();
    }

    // Negate Task done attribute.
    @GetMapping("/tasks/{id}/mark")
    ResponseEntity<?> mark(@PathVariable UUID id) {

        TaskFinder finder = new TaskFinder(id, taskRepository);

        Task task = finder.get(TaskFinder.Access.OWNER);

        // Negate attribute.
        task.setDone(!task.isDone());

        taskRepository.save(task);

        return ResponseEntity.noContent().build();
    }

    // Get shared Task by id.
    // Endpoint for anonymous users.
    @GetMapping("/tasks/shared/{id}")
    EntityModel<Task> shared(@PathVariable UUID id) {

        TaskFinder finder = new TaskFinder(id, taskRepository);

        Task task = finder.get(TaskFinder.Access.SHARED);

        return assembler.toModel(task);
    }

    // Update an existing Task with id.
    @PutMapping("/tasks/{id}")
    ResponseEntity<?> replaceTask(@Valid @RequestBody Task newTask, @PathVariable UUID id) {

        TaskFinder finder = new TaskFinder(id, taskRepository);

        Task task = finder.get(TaskFinder.Access.OWNER);

        // Update attributes.
        task.setName(newTask.getName());
        task.setDueDateTime(newTask.getDueDateTime());
        task.setDescription(newTask.getDescription());
        task.setPriority(newTask.getPriority());

        taskRepository.save(task);

        EntityModel<Task> entityModel = assembler.toModel(task);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Delete existing Task.
    @DeleteMapping("/tasks/{id}")
    ResponseEntity<?> deleteTask(@PathVariable UUID id) {

        TaskFinder finder = new TaskFinder(id, taskRepository);

        Task task = finder.get(TaskFinder.Access.OWNER);

        taskRepository.delete(task);

        return ResponseEntity.noContent().build();
    }
}
