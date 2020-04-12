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

    @NotBlank(message = "Email is mandatory")
    private String email;

    private boolean enabled = true;
    private String roles = "ROLE_USER";

    public User() {}

    public User(String username, String password, String email, boolean enabled, String roles) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.enabled = enabled;
        this.roles = roles;
    }
}
