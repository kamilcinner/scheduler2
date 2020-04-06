package com.github.kamilcinner.scheduler2.backend.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Data
@Entity
public class Task {
    private @Id @GeneratedValue UUID id;
    private String name;

    public Task() {}

    public Task(String name) {
        this.name = name;
    }
}
