package com.github.kamilcinner.scheduler2.backend.tasks.controllers.helpers;

import java.util.UUID;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(UUID id) {
        super("Could not find task " + id);
    }
}
