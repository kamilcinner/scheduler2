package com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.list;

import java.util.UUID;

public class ShoppingListItemNotFoundException extends RuntimeException {

    public ShoppingListItemNotFoundException(UUID id) {
        super("Could not find shopping list item " + id);
    }
}
