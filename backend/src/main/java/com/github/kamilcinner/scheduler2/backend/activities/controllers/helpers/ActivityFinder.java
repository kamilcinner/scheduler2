package com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers;

import com.github.kamilcinner.scheduler2.backend.activities.models.Activity;
import com.github.kamilcinner.scheduler2.backend.activities.repositories.ActivityRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.item.ShoppingListNotFoundException;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;

import java.util.UUID;

public class ActivityFinder {

    public enum Access {
        OWNER
    }

    private final UUID id;
    private final ActivityRepository repository;

    public ActivityFinder(UUID id, ActivityRepository repository) {
        this.id = id;
        this.repository = repository;
    }

    private boolean checkAccess(Activity activity, Access access) {

        switch (access) {
            case OWNER:
                if (!activity.getOwnerUsername().equals(CurrentUserUsername.get())) return false;
                break;
            default: return false;
        }
        return true;
    }

    public Activity get(Access access) throws ActivityNotFoundException {

        return repository.findById(id)
                .map(activity -> {
                    // Check access to the Ativity.
                    if (!checkAccess(activity, access)) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    // If there is an access then return the Activity.
                    return activity;
                })
                .orElseThrow(() -> new ActivityNotFoundException(id));
    }
}
