package com.github.kamilcinner.scheduler2.backend.models;

import lombok.Data;
import org.springframework.security.core.userdetails.User;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Data
@Entity
public class Task {
    private @Id @GeneratedValue UUID id;
    private String ownerUsername;
    private String name;

    public Task() {}

    public Task(String ownerUsername, String name) {
        this.ownerUsername = ownerUsername;
        this.name = name;
    }
}
