package com.github.kamilcinner.scheduler2.backend.shopping.repositories;

import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingListItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShoppingListItemRepository extends JpaRepository<ShoppingListItem, UUID> {

}
