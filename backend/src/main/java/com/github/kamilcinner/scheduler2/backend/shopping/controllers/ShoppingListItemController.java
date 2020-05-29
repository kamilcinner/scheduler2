package com.github.kamilcinner.scheduler2.backend.shopping.controllers;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingListItemModelAssembler;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingListNotFoundException;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListItemRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListRepository;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

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

    ShoppingListItemController(ShoppingListRepository shoppingListRepository, ShoppingListItemRepository shoppingListItemRepository,
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

        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .map(searchedShoppingList -> {
                    if (!searchedShoppingList.getOwnerUsername().equals(CurrentUserUsername.get()) && !searchedShoppingList.isShared()) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    return searchedShoppingList;
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        List<EntityModel<ShoppingListItem>> shoppingListItems = shoppingListItemRepository.findAllByShoppingList(shoppingList,
                Sort.by(Sort.Direction.ASC, "done", "name")).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(shoppingListItems,
                linkTo(methodOn(ShoppingListItemController.class).allByShoppingList(id)).withSelfRel());
    }

    // Get shared Shopping list items.
    // Endpoint for anonymous users.
    @GetMapping("/shoppinglists/shared/{id}/items")
    CollectionModel<?> shared(@PathVariable UUID id) {

        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .map(searchedShoppingList -> {
                    if (!searchedShoppingList.isShared()) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    return searchedShoppingList;
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        List<EntityModel<ShoppingListItem>> shoppingListItems = shoppingListItemRepository.findAllByShoppingList(shoppingList,
                Sort.by(Sort.Direction.ASC, "done", "name")).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(shoppingListItems,
                linkTo(methodOn(ShoppingListItemController.class).allByShoppingList(id)).withSelfRel());
    }
}
