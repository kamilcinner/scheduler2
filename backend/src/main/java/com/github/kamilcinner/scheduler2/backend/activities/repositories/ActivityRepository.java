package com.github.kamilcinner.scheduler2.backend.activities.repositories;

import com.github.kamilcinner.scheduler2.backend.activities.models.Activity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    List<Activity> findByOwnerUsername(String username, Sort sort);
}
