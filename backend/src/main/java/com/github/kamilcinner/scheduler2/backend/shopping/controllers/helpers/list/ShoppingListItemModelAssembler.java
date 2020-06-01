package com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.list;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.ShoppingListController;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.ShoppingListItemController;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class ShoppingListItemModelAssembler implements RepresentationModelAssembler<ShoppingListItem, EntityModel<ShoppingListItem>> {

    @Override
    public EntityModel<ShoppingListItem> toModel(ShoppingListItem entity) {

        // Shopping list id.
        UUID id = entity.getShoppingList().getId();

        return new EntityModel<>(entity,
                linkTo(methodOn(ShoppingListController.class).one(entity.getId())).withSelfRel(),
                linkTo(methodOn(ShoppingListItemController.class).allByShoppingList(id)).withRel("items"));
    }
}
