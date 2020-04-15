package com.github.kamilcinner.scheduler2.backend.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Entity(name = "SchedulerUser")
public class User {
    @NotBlank(message = "Username is required.")
    @Size(
        min = 5,
        max = 20,
        message = "Username must be between {min} and {max} characters long."
    )
    private @Id String username;

    @NotBlank(message = "Password is required.")
    private String password;

    @NotBlank(message = "Email is required.")
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
