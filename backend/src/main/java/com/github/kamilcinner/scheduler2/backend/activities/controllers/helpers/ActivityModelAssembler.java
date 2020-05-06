package com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers;

import com.github.kamilcinner.scheduler2.backend.activities.controllers.ActivityController;
import com.github.kamilcinner.scheduler2.backend.activities.models.Activity;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class ActivityModelAssembler implements RepresentationModelAssembler<Activity, EntityModel<Activity>> {

    @Override
    public EntityModel<Activity> toModel(Activity activity) {

        return new EntityModel<>(activity,
                linkTo(methodOn(ActivityController.class).one(activity.getId())).withSelfRel(),
                linkTo(methodOn(ActivityController.class).all()).withRel("activities"));
    }
}
