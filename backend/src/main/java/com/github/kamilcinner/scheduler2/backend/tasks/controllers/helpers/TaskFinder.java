package com.github.kamilcinner.scheduler2.backend.tasks.controllers.helpers;

import com.github.kamilcinner.scheduler2.backend.tasks.models.Task;
import com.github.kamilcinner.scheduler2.backend.tasks.repositories.TaskRepository;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;

import java.util.UUID;

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

    private boolean checkAccess(Task task, Access access) {

        switch (access) {
            case OWNER:
                if (!task.getOwnerUsername().equals(CurrentUserUsername.get())) return false;
                break;

            case OWNER_OR_SHARED:
                if (!task.getOwnerUsername().equals(CurrentUserUsername.get()) && !task.isShared()) return false;
                break;

            case SHARED:
                if (!task.isShared()) return false;
                break;

            default: return false;
        }
        return true;
    }

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
