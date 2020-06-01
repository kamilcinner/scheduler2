package com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.item;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.ShoppingListController;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class ShoppingListModelAssembler implements RepresentationModelAssembler<ShoppingList, EntityModel<ShoppingList>> {

    @Override
    public EntityModel<ShoppingList> toModel(ShoppingList entity) {

        return new EntityModel<>(entity,
                linkTo(methodOn(ShoppingListController.class).one(entity.getId())).withSelfRel(),
                linkTo(methodOn(ShoppingListController.class).all()).withRel("shoppinglists"));
    }
}
