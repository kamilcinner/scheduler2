package com.github.kamilcinner.scheduler2.backend.shopping.repositories;

import com.github.kamilcinner.scheduler2.backend.shopping.models.ShoppingList;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ShoppingListRepository extends JpaRepository<ShoppingList, UUID> {
    List<ShoppingList> findByOwnerUsername(String username, Sort sort);
}
