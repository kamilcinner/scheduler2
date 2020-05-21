package com.github.kamilcinner.scheduler2.backend.shopping.models;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.UUID;

@Data
@Entity
public class ShoppingListItem {

    private @Id @GeneratedValue UUID id;

    @ManyToOne
    @JoinColumn
    private ShoppingList shoppingList;

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
