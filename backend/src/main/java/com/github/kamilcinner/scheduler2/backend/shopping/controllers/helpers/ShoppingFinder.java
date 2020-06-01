package com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers;

import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.item.ShoppingListNotFoundException;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.list.ShoppingListItemNotFoundException;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListItemRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.repositories.ShoppingListRepository;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.UUID;

/**
 * Finds Shopping list or Item by id (UUID).
 * Provide methods for deleting list Items and list itself.
 * Provide getters for Shopping lists and Items.
 */
public class ShoppingFinder {

    public enum Access {
        OWNER,
        OWNER_OR_SHARED,
        SHARED
    }

    private final UUID id;
    private final ShoppingListRepository listRepository;
    private final ShoppingListItemRepository itemRepository;

    public ShoppingFinder(UUID id, ShoppingListRepository listRepository, ShoppingListItemRepository itemRepository) {

        this.id = id;
        this.listRepository = listRepository;
        this.itemRepository = itemRepository;
    }

    /**
     * @param list on which access condition will be checked.
     * @param access condition of access to the list.
     * @return True if access condition to the list is met; False otherwise.
     */
    private boolean checkAccess(ShoppingList list, Access access) {

        switch (access) {
            case OWNER:
                if (!list.getOwnerUsername().equals(CurrentUserUsername.get())) return false;
                break;

            case OWNER_OR_SHARED:
                if (!list.getOwnerUsername().equals(CurrentUserUsername.get()) && !list.isShared()) return false;
                break;

            case SHARED:
                if (!list.isShared()) return false;
                break;

            default: return false;
        }
        return true;
    }

    /**
     * @param access condition of access to the list.
     * @return ShoppingList if it exist and access condition is met.
     * @throws ShoppingListNotFoundException if the Shopping list cannot be found or if the condition access is not met.
     */
    public ShoppingList getList(Access access) throws ShoppingListNotFoundException {

        return listRepository.findById(id)
                .map(list -> {
                    // Check access to the List.
                    if (!checkAccess(list, access)) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    // If there is an access then return the List.
                    return list;
                })
                .orElseThrow(() -> new ShoppingListNotFoundException(id));
    }

    /**
     * Delete all Items from Shopping list.
     * @param access condition of access to the list.
     * @throws ShoppingListNotFoundException if the Shopping list cannot be found or if the condition access is not met.
     */
    public void deleteItems(Access access) throws ShoppingListNotFoundException {

        // Get Java List of Items.
        List<ShoppingListItem> shoppingListItems = itemRepository.findAllByShoppingList(getList(access),
                Sort.unsorted());

        // Delete each item.
        for (ShoppingListItem item : shoppingListItems) {
            itemRepository.deleteById(item.getId());
        }
    }

    /**
     * Delete Shopping list with all its Items.
     * @param access condition of access to the list.
     * @throws ShoppingListNotFoundException if the Shopping list cannot be found or if the condition access is not met.
     */
    public void deleteListAndItems(Access access) throws ShoppingListNotFoundException {

        deleteItems(access);
        // Delete Shopping list.
        listRepository.deleteById(id);
    }

    /**
     * @param access condition of access to the list.
     * @return Sorted by "done" and "name" List of Items if parent Shopping list exist and access condition is met.
     * @throws ShoppingListNotFoundException if the Shopping list cannot be found or if the condition access is not met.
     */
    public List<ShoppingListItem> getItems(Access access) throws ShoppingListNotFoundException {
        return itemRepository.findAllByShoppingList(getList(access),
                Sort.by(Sort.Direction.ASC, "done", "name"));
    }

    /**
     * @param access condition of access to the Item.
     * @return ShoppingListItem if it exist and access condition is met.
     * @throws ShoppingListItemNotFoundException if the Item cannot be found or if the condition access is not met.
     */
    public ShoppingListItem getItem(Access access) throws ShoppingListItemNotFoundException {

        return itemRepository.findById(id)
                .map(item -> {
                    // Check access to the Item.
                    if (!checkAccess(item.getShoppingList(), access)) {
                        throw new ShoppingListItemNotFoundException(id);
                    }
                    // If there is an access then return the Item.
                    return item;
                })
                .orElseThrow(() -> new ShoppingListItemNotFoundException(id));
    }
}
