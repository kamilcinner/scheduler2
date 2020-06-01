package com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers;

import com.github.kamilcinner.scheduler2.backend.activities.models.Activity;
import com.github.kamilcinner.scheduler2.backend.activities.repositories.ActivityRepository;
import com.github.kamilcinner.scheduler2.backend.shopping.controllers.helpers.item.ShoppingListNotFoundException;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;

import java.util.UUID;

/**
 * Finds Activity by id (UUID).
 */
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

    /**
     * @param activity on which access condition will be check.
     * @param access condition of access to the list.
     * @return true if access condition to the list is met; false otherwise.
     */
    private boolean checkAccess(Activity activity, Access access) {

        switch (access) {
            case OWNER:
                return activity.getOwnerUsername().equals(CurrentUserUsername.get());

            default: return false;
        }
    }

    /**
     * @param access condition of access to the Activity.
     * @return Activity if exist and access condition is met.
     * @throws ActivityNotFoundException if Activity doesn't exist or the access condition isn't met.
     */
    public Activity get(Access access) throws ActivityNotFoundException {

        return repository.findById(id)
                .map(activity -> {
                    // Check access to the Activity.
                    if (!checkAccess(activity, access)) {
                        throw new ShoppingListNotFoundException(id);
                    }
                    // If there is an access then return the Activity.
                    return activity;
                })
                .orElseThrow(() -> new ActivityNotFoundException(id));
    }
}
