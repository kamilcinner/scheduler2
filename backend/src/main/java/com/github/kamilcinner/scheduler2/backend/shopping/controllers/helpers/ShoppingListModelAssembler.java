package com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.ShoppingListController;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import com.github.kamilcinner.scheduler2.backend.shopping.models.helpers.ShoppingListWithItems;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListItemRepository;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ShoppingListModelAssembler implements RepresentationModelAssembler<ShoppingList, EntityModel<ShoppingList>> {

//    private final ShoppingListItemRepository shoppingListItemRepository;
//
//    ShoppingListModelAssembler(ShoppingListItemRepository shoppingListItemRepository) {
//        this.shoppingListItemRepository = shoppingListItemRepository;
//    }
//
    @Override
    public EntityModel<ShoppingList> toModel(ShoppingList entity) {

//        List<ShoppingListItem> shoppingListItems = shoppingListItemRepository.findByShoppingList(entity,
//                Sort.by(Sort.Direction.ASC, "done", "name"));

        return new EntityModel<>(entity,
                linkTo(methodOn(ShoppingListController.class).one(entity.getId())).withSelfRel(),
                linkTo(methodOn(ShoppingListController.class).all()).withRel("shoppinglists"));
    }

//    @Override
//    public EntityModel<ShoppingListWithItems> toModel(ShoppingListWithItems entity) {
//
//        return new EntityModel<>(entity,
////                linkTo(methodOn(ShoppingListController.class).one(entity.getId())).withSelfRel(),
//                linkTo(methodOn(ShoppingListController.class).all()).withRel("shoppinglists"));
//    }
}
