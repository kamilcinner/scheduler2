package com.github.kamilcinner.scheduler2.backend.tasks.controllers.helpers;

import com.github.kamilcinner.scheduler2.backend.tasks.models.Task;
import com.github.kamilcinner.scheduler2.backend.tasks.repositories.TaskRepository;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;

import java.util.UUID;

/**
 * Finds Task by id (UUID).
 */
public class TaskFinder {

    public enum Access {
        OWNER,
        OWNER_OR_SHARED,
        SHARED
    }

    private final UUID id;
    private final TaskRepository repository;

    public TaskFinder(UUID id, TaskRepository repository) {
        this.id = id;
        this.repository = repository;
    }

    /**
     * @param task on which access condition will be check.
     * @param access condition of access to the Task.
     * @return true if access condition to the list is met; false otherwise.
     */
    private boolean checkAccess(Task task, Access access) {

        switch (access) {
            case OWNER:
                return task.getOwnerUsername().equals(CurrentUserUsername.get());

            case OWNER_OR_SHARED:
                return task.getOwnerUsername().equals(CurrentUserUsername.get()) || task.isShared();

            case SHARED:
                return task.isShared();

            default: return false;
        }
    }

    /**
     * @param access condition of access to the Task.
     * @return Task if exist and access condition is met.
     * @throws TaskNotFoundException if Task doesn't exist or the access condition isn't met.
     */
    public Task get(Access access) throws TaskNotFoundException {

        return repository.findById(id)
                .map(task -> {
                    // Check access to the Task.
                    if (!checkAccess(task, access)) {
                        throw new TaskNotFoundException(id);
                    }
                    // If there is an access then return the Task.
                    return task;
                })
                .orElseThrow(() -> new TaskNotFoundException(id));
    }
}
