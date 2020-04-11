package com.github.kamilcinner.scheduler2.backend.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

@Data
@Entity(name = "SchedulerUser")
public class User {
    @NotBlank(message = "Username is mandatory")
    private @Id String username;

    @NotBlank(message = "Password is mandatory")
    private String password;

    private boolean active = true;
    private String roles = "ROLE_USER";

    public User() {}

    public User(String username, String password, boolean active, String roles) {
        this.username = username;
        this.password = password;
        this.active = active;
        this.roles = roles;
    }
}
