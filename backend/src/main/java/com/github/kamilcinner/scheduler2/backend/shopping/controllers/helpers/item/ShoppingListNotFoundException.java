package com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.item;

import java.util.UUID;

public class ShoppingListNotFoundException extends RuntimeException {

    public ShoppingListNotFoundException(UUID id) {
        super("Could not find shopping list " + id);
    }
}
