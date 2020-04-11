package com.github.kamilcinner.scheduler2.backend.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.TableGenerator;

@Data
@Entity(name = "SchedulerUser")
public class User {
    private @Id String username;
    private String password;
    private boolean active;
    private String roles;

    public User() {}

    public User(String username, String password, boolean active, String roles) {
        this.username = username;
        this.password = password;
        this.active = active;
        this.roles = roles;
    }
}
