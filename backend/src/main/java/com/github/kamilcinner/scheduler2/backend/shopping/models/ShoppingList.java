package com.github.kamilcinner.scheduler2.backend.shopping.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class ShoppingList {

    private @Id @GeneratedValue UUID id;

    // Owner username will be added during Shopping List creation.
    private String ownerUsername;

    @NotBlank(message = "Shopping List name is required.")
    @NotNull(message = "Shopping List name is required.")
    @Size(
            max = 100,
            message = "Name can be up to {max} characters long."
    )
    private String name;

    private Timestamp lastEditDateTime = Timestamp.valueOf(LocalDateTime.now());

    private boolean shared = false;

    public ShoppingList() {}

    public ShoppingList(String ownerUsername, String name) {
        this.ownerUsername = ownerUsername;
        this.name = name;
    }
}
