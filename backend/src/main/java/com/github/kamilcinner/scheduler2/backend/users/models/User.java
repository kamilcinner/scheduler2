package com.github.kamilcinner.scheduler2.backend.users.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data
@Entity(name = "SchedulerUser")
public class User {

    @NotBlank(message = "Username is required.")
    @NotNull(message = "Username is required.")
    @Size(
        min = 5,
        max = 20,
        message = "Username must be between {min} and {max} characters long."
    )
    @Pattern(regexp = "^[a-zA-Z0-9_.]+$",
            message = "You can use only letters, numbers and _. signs."
    )
    private @Id String username;

    @NotBlank(message = "Password is required.")
    @NotNull(message = "Password is required.")
    @Size(
            min = 8,
            max = 100,
            message = "Password must be between {min} and {max} characters long."
    )
    private String password;

    @NotBlank(message = "Email is required.")
    @NotNull(message = "Email is required.")
    @Pattern(regexp = "^[a-zA-Z0-9_.]+@[a-zA-Z0-9\\-]+\\.[a-zA-Z0-9\\-.]+$",
            message = "Email is invalid - follow example@email.com."
    )
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
