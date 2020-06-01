package com.github.kamilcinner.scheduler2.backend.shopping.models;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.UUID;

@Data
@Entity
public class ShoppingListItem {

    private @Id @GeneratedValue UUID id;

    // Foreign key definition.
    @ManyToOne
    @JoinColumn
    private ShoppingList shoppingList;

    @NotBlank(message = "Item name is required.")
    @NotNull(message = "Item name is required.")
    @Size(
            max = 100,
            message = "Name can be up to {max} characters long."
    )
    private String name;

    private boolean done = false;

    public ShoppingListItem() {}

    public ShoppingListItem(ShoppingList shoppingList, String name) {
        this.shoppingList = shoppingList;
        this.name = name;
    }
}
