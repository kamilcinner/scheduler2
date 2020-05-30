package com.github.kamilcinner.scheduler2.backend.shopping.controllers;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingListItemModelAssembler;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingListItemNotFoundException;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingListNotFoundException;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListItemRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListRepository;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

    // Delete all items by Shopping list id.
    @DeleteMapping("/shoppinglists/{id}/items")
    ResponseEntity<?> deleteAllItems(@PathVariable UUID id) {

        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .map(shoppingListToDelete -> {
                    if (!shoppingListToDelete.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new ShoppingListNotFoundException(id);
                    }

                    return shoppingListToDelete;
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        List<ShoppingListItem> shoppingListItems = shoppingListItemRepository.findAllByShoppingList(shoppingList,
                Sort.unsorted());

        for (ShoppingListItem item : shoppingListItems) {
            shoppingListItemRepository.deleteById(item.getId());
        }

        return ResponseEntity.noContent().build();
    }

    // Create new Shopping list item.
    @PostMapping("/shoppinglists/{id}/items")
    ResponseEntity<?> newItem(@PathVariable UUID id, @Valid @RequestBody ShoppingListItem newItem) {

        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .map(shoppingListToDelete -> {
                    if (!shoppingListToDelete.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new ShoppingListNotFoundException(id);
                    }

                    return shoppingListToDelete;
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        newItem.setShoppingList(shoppingList);

        EntityModel<ShoppingListItem> entityModel = assembler.toModel(shoppingListItemRepository.save(newItem));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Get one item.
    @GetMapping("/shoppinglists/items/{id}")
    EntityModel<ShoppingListItem> one(@PathVariable UUID id) {

        ShoppingListItem shoppingListItem = shoppingListItemRepository.findById(id)
                .map(searchedShoppingListItem -> {
                    if (!searchedShoppingListItem.getShoppingList().getOwnerUsername().equals(CurrentUserUsername.get())
                            && !searchedShoppingListItem.getShoppingList().isShared()) {
                        throw new ShoppingListItemNotFoundException(id);
                    }
                    return searchedShoppingListItem;
                })
                .orElseThrow(() -> new ShoppingListItemNotFoundException(id));

        return assembler.toModel(shoppingListItem);
    }

    // Negate item shared attribute.
    @GetMapping("/shoppinglists/items/{id}/mark")
    ResponseEntity<?> markDone(@PathVariable UUID id) {

        shoppingListItemRepository.findById(id)
                .map(itemToUpdate -> {
                    if (!itemToUpdate.getShoppingList().getOwnerUsername().equals(CurrentUserUsername.get())
                            && !itemToUpdate.getShoppingList().isShared()) {
                        throw new ShoppingListItemNotFoundException(id);
                    }
                    itemToUpdate.setDone(!itemToUpdate.isDone());

                    return shoppingListItemRepository.save(itemToUpdate);
                })
                .orElseThrow(() -> new ShoppingListItemNotFoundException(id));

        return ResponseEntity.noContent().build();
    }
}
