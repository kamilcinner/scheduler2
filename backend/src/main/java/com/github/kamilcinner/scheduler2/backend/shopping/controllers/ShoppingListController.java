package com.github.kamilcinner.scheduler2.backend.shopping.controllers;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.ShoppingFinder;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.item.ShoppingListModelAssembler;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
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
public class ShoppingListController {

    private final ShoppingListRepository shoppingListRepository;
    private final ShoppingListItemRepository shoppingListItemRepository;
    private final ShoppingListModelAssembler assembler;

    ShoppingListController(ShoppingListRepository shoppingListRepository,
                           ShoppingListItemRepository shoppingListItemRepository,
                           ShoppingListModelAssembler assembler) {

        this.shoppingListRepository = shoppingListRepository;
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.assembler = assembler;
    }

    // Get all Shopping lists.
    @GetMapping("/shoppinglists")
    public CollectionModel<?> all() {

        // Get all Shopping lists by current user name.
        // Sort them by last edit date and time.
        // Assemble their models.
        List<EntityModel<ShoppingList>> shoppingLists = shoppingListRepository.findByOwnerUsername(
                CurrentUserUsername.get(),
                Sort.by(Sort.Direction.ASC, "lastEditDateTime")).stream()
                    .map(assembler::toModel)
                    .collect(Collectors.toList());

        return new CollectionModel<>(shoppingLists,
                linkTo(methodOn(ShoppingListController.class).all()).withSelfRel());
    }

    // Create a new Shopping list.
    @PostMapping("/shoppinglists")
    ResponseEntity<?> newShoppingList(@Valid @RequestBody ShoppingList newShoppingList) {

        // Set owner.
        newShoppingList.setOwnerUsername(CurrentUserUsername.get());

        EntityModel<ShoppingList> entityModel = assembler.toModel(shoppingListRepository.save(newShoppingList));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Get one Shopping list by id.
    // Can be accessed always by Shopping list owner.
    // Can be accessed by other users only if Shopping list is shared.
    @GetMapping("/shoppinglists/{id}")
    public EntityModel<ShoppingList> one(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        ShoppingList shoppingList = finder.getList(ShoppingFinder.Access.OWNER_OR_SHARED);

        return assembler.toModel(shoppingList);
    }

    // Negate Shopping list shared attribute.
    @GetMapping("/shoppinglists/{id}/share")
    ResponseEntity<?> share(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        ShoppingList shoppingList = finder.getList(ShoppingFinder.Access.OWNER);

        // Negate attribute.
        shoppingList.setShared(!shoppingList.isShared());

        shoppingListRepository.save(shoppingList);

        return ResponseEntity.noContent().build();
    }

    // Get shared Shopping list by id.
    // Endpoint for anonymous users.
    @GetMapping("/shoppinglists/shared/{id}")
    EntityModel<ShoppingList> shared(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        ShoppingList shoppingList = finder.getList(ShoppingFinder.Access.SHARED);

        return assembler.toModel(shoppingList);
    }

    // Update an existing Shopping list.
    @PutMapping("/shoppinglists/{id}")
    ResponseEntity<?> replaceShoppingList(@Valid @RequestBody ShoppingList newShoppingList, @PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        ShoppingList shoppingList = finder.getList(ShoppingFinder.Access.OWNER);

        // Update attributes.
        shoppingList.setName(newShoppingList.getName());
        shoppingList.setLastEditDateTime(newShoppingList.getLastEditDateTime());

        shoppingListRepository.save(shoppingList);

        EntityModel<ShoppingList> entityModel = assembler.toModel(shoppingList);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Delete an existing Shopping list.
    @DeleteMapping("/shoppinglists/{id}")
    ResponseEntity<?> deleteShoppingList(@PathVariable UUID id) {

        ShoppingFinder finder = new ShoppingFinder(id, shoppingListRepository, shoppingListItemRepository);

        finder.deleteListAndItems(ShoppingFinder.Access.OWNER);

        return ResponseEntity.noContent().build();
    }
}
