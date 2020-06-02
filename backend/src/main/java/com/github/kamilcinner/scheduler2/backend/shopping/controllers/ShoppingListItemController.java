package com.github.kamilcinner.scheduler2.backend.shopping.controllers;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingFinder;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.list.ShoppingListItemModelAssembler;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListItemRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class ShoppingListItemController {

    private final ShoppingListRepository shoppingListRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;


    private final ShoppingListItemModelAssembler assembler;

    ShoppingListItemController(ShoppingListRepository shoppingListRepository,
                               ShoppingListItemRepository shoppingListItemRepository,
                               ShoppingListItemModelAssembler assembler) {

        this.shoppingListRepository = shoppingListRepository;
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.assembler = assembler;
    }

    // Get items by shopping list id.
    // Can be accessed always by ShoppingList owner.
    // Can be accessed by other users only if ShoppingList is shared.
    @GetMapping("/shoppinglists/{id}/items")
    public CollectionModel<?> allByShoppingList(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        // Get all Items by Shopping list id using finder.
        // Assemble their models.
        List<EntityModel<ShoppingListItem>> shoppingListItems = finder.getItems(ShoppingFinder.Access.OWNER_OR_SHARED).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(shoppingListItems,
                linkTo(methodOn(ShoppingListItemController.class).allByShoppingList(id)).withSelfRel());
    }

    // Get shared Shopping list items.
    // Endpoint for anonymous users.
    @GetMapping("/shoppinglists/shared/{id}/items")
    CollectionModel<?> shared(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        List<EntityModel<ShoppingListItem>> shoppingListItems = finder.getItems(ShoppingFinder.Access.SHARED).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(shoppingListItems,
                linkTo(methodOn(ShoppingListItemController.class).allByShoppingList(id)).withSelfRel());
    }

    // Delete all items by Shopping list id.
    @DeleteMapping("/shoppinglists/{id}/items")
    ResponseEntity<?> deleteAllItems(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        finder.deleteItems(ShoppingFinder.Access.OWNER);

        ShoppingList shoppingList = finder.getList(ShoppingFinder.Access.OWNER);

        // Update last edit date and time.
        shoppingList.setLastEditDateTime(Timestamp.valueOf(LocalDateTime.now()));

        shoppingListRepository.save(shoppingList);

        return ResponseEntity.noContent().build();
    }

    // Create new Shopping list Item.
    @PostMapping("/shoppinglists/{id}/items")
    ResponseEntity<?> newItem(@PathVariable UUID id, @Valid @RequestBody ShoppingListItem newItem) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        ShoppingList shoppingList = finder.getList(ShoppingFinder.Access.OWNER);

        // Assign Shopping list to Item.
        newItem.setShoppingList(shoppingList);

        EntityModel<ShoppingListItem> entityModel = assembler.toModel(shoppingListItemRepository.save(newItem));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Get one item.
    @GetMapping("/shoppinglists/items/{id}")
    EntityModel<ShoppingListItem> one(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        ShoppingListItem shoppingListItem = finder.getItem(ShoppingFinder.Access.OWNER);

        return assembler.toModel(shoppingListItem);
    }

    // Negate item done attribute.
    // Accessible for owners only or also others if Shopping list is shared.
    @GetMapping("/shoppinglists/items/{id}/mark")
    ResponseEntity<?> markDone(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        ShoppingListItem shoppingListItem = finder.getItem(ShoppingFinder.Access.OWNER_OR_SHARED);

        // Negate attribute.
        shoppingListItem.setDone(!shoppingListItem.isDone());

        shoppingListItemRepository.save(shoppingListItem);

        return ResponseEntity.noContent().build();
    }
}
