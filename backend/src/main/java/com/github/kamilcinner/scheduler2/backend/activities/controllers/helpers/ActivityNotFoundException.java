package com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers;

import java.util.UUID;

public class ActivityNotFoundException extends RuntimeException {

    public ActivityNotFoundException(UUID id) {
        super("Could not find activity " + id);
    }
}
