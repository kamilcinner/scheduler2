package com.github.kamilcinner.scheduler2.backend.shopping.models.helpers;

import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
public class ShoppingListWithItems {

    private UUID id;
    private String ownerUsername;
    private String name;
    private Timestamp lastEditDateTime;
    private boolean shared;

    private List<ShoppingListItem> shoppingListItems;

    public ShoppingListWithItems(UUID id, String ownerUsername, String name,
                                 Timestamp lastEditDateTime, boolean shared, List<ShoppingListItem> shoppingListItems) {
        this.id = id;
        this.ownerUsername = ownerUsername;
        this.name = name;
        this.lastEditDateTime = lastEditDateTime;
        this.shared = shared;
        this.shoppingListItems = shoppingListItems;
    }
}
