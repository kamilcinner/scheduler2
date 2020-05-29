package com.github.kamilcinner.scheduler2.backend.shopping.controllers;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingListModelAssembler;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingListNotFoundException;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import com.github.kamilcinner.scheduler2.backend.shopping.models.helpers.ShoppingListWithItems;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListItemRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListRepository;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;
import org.apache.coyote.Response;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class ShoppingListController {

    private final ShoppingListRepository shoppingListRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;
    private final ShoppingListModelAssembler assembler;

    ShoppingListController(ShoppingListRepository shoppingListRepository, ShoppingListItemRepository shoppingListItemRepository, ShoppingListModelAssembler assembler) {
        this.shoppingListRepository = shoppingListRepository;
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.assembler = assembler;
    }

    // Aggregate root.

    @GetMapping("/shoppinglists")
    public CollectionModel<?> all() {
//        List<ShoppingList> shoppingLists = shoppingListRepository.findByOwnerUsername(CurrentUserUsername.get(),
//                Sort.by(Sort.Direction.ASC, "lastEditDateTime"));
//
//        List<ShoppingListWithItems> shoppingListsWithItems = new ArrayList<>();
//        for (ShoppingList shoppingList : shoppingLists) {
//            List<ShoppingListItem> shoppingListItems = shoppingListItemRepository.findByShoppingList(shoppingList,
//                    Sort.by(Sort.Direction.ASC, "done", "name"));
//
//            shoppingListsWithItems.add(new ShoppingListWithItems(shoppingList.getId(), shoppingList.getOwnerUsername(),
//                    shoppingList.getName(), shoppingList.getLastEditDateTime(), shoppingList.isShared(), shoppingListItems));
//        }
//
//        List<EntityModel<ShoppingListWithItems>> shoppingListsWithItemsEntities = shoppingListsWithItems.stream()
//                .map(assembler::toModel)
//                .collect(Collectors.toList());
//
//        return new CollectionModel<>(shoppingListsWithItemsEntities,
//                linkTo(methodOn(ShoppingListController.class).all()).withSelfRel());

        List<EntityModel<ShoppingList>> shoppingLists = shoppingListRepository.findByOwnerUsername(CurrentUserUsername.get(),
                Sort.by(Sort.Direction.ASC, "lastEditDateTime")).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(shoppingLists,
                linkTo(methodOn(ShoppingListController.class).all()).withSelfRel());
    }

    // Get shared ShoppingList by id.
    // Endpoint for anonymous users.

    @PostMapping("/shoppinglists")
    ResponseEntity<?> newShoppingList(@Valid @RequestBody ShoppingList newShoppingList) {
        newShoppingList.setOwnerUsername(CurrentUserUsername.get());

        EntityModel<ShoppingList> entityModel = assembler.toModel(shoppingListRepository.save(newShoppingList));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Single item.

    // Get ShoppingList by id.
    // Can be accessed always by ShoppingList owner.
    // Can be accessed by other users only if ShoppingList is shared.
    @GetMapping("/shoppinglists/{id}")
    public EntityModel<ShoppingList> one(@PathVariable UUID id) {

        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .map(searchedShoppingList -> {
                    if (!searchedShoppingList.getOwnerUsername().equals(CurrentUserUsername.get()) && !searchedShoppingList.isShared()) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    return searchedShoppingList;
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        return assembler.toModel(shoppingList);
    }

    // Negate ShoppingList shared attribute.
    @GetMapping("/shoppinglists/share/{id}")
    ResponseEntity<?> share(@PathVariable UUID id) {

        shoppingListRepository.findById(id)
                .map(shoppingListToUpdate -> {
                    if (!shoppingListToUpdate.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    shoppingListToUpdate.setShared(!shoppingListToUpdate.isShared());

                    return shoppingListRepository.save(shoppingListToUpdate);
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        return ResponseEntity.noContent().build();
    }

    // Get shared Shopping list by id.
    // Endpoint for anonymous users.
    @GetMapping("/shoppinglists/shared/{id}")
    EntityModel<ShoppingList> shared(@PathVariable UUID id) {

        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .map(searchedShoppingList -> {
                    if (!searchedShoppingList.isShared()) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    return searchedShoppingList;
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        return assembler.toModel(shoppingList);
    }

    // Update existing ShoppingList.
    @PutMapping("/shoppinglists/{id}")
    ResponseEntity<?> replaceShoppingList(@Valid @RequestBody ShoppingList newShoppingList, @PathVariable UUID id) {
        ShoppingList updatedShoppingList = shoppingListRepository.findById(id)
                .map(shoppingList -> {
                    if (shoppingList.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new ShoppingListNotFoundException(id);
                    }

                    shoppingList.setName(newShoppingList.getName());
                    shoppingList.setLastEditDateTime(newShoppingList.getLastEditDateTime());

                    return shoppingListRepository.save(shoppingList);
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));

        EntityModel<ShoppingList> entityModel = assembler.toModel(updatedShoppingList);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Delete existing ShoppingList.
    @DeleteMapping("/shoppinglists/{id}")
    ResponseEntity<?> deleteShoppingList(@PathVariable UUID id) {

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

        shoppingListRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
