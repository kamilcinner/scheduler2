package com.github.kamilcinner.scheduler2.backend.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.util.UUID;

@Data
@Entity
public class Task {
    private @Id @GeneratedValue UUID id;

    // Owner username must be automatically added during Task creating.
    private String ownerUsername;

    @NotBlank(message = "Task name is mandatory")
    private String name;

    @NotNull(message = "Task due date is mandatory")
    private Timestamp dueDateTime;

    // Description is optional.
    private String description = "";

    // Status means that is Task active (ongoing).
    private boolean status = true;

    // Is Task shared to other users.
    // Shared means that anyone (even anonymous user)
    // can see this Task by URL but can't edit it.
    private boolean shared = false;

    // Task priority.
    // h - high
    // n - normal (default)
    // l - low
    private char priority = 'n';

    public Task() {}

    public Task(String ownerUsername, String name, Timestamp dueDateTime, String description,
                boolean status, boolean shared, char priority) {
        this.ownerUsername = ownerUsername;
        this.name = name;
        this.dueDateTime = dueDateTime;
        this.description = description;
        this.status = status;
        this.shared = shared;
        this.priority = priority;
    }
}
