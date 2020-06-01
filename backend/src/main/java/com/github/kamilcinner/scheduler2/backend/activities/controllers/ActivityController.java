package com.github.kamilcinner.scheduler2.backend.activities.controllers;

import com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers.ActivityFinder;
import com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers.ActivityModelAssembler;
import com.github.kamilcinner.scheduler2.backend.activities.models.Activity;
import com.github.kamilcinner.scheduler2.backend.activities.repositories.ActivityRepository;
import com.github.kamilcinner.scheduler2.backend.addons.PollubParser;
import com.github.kamilcinner.scheduler2.backend.addons.Subject;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class ActivityController {

    private final ActivityRepository activityRepository;
    private final ActivityModelAssembler assembler;

    public ActivityController(ActivityRepository activityRepository, ActivityModelAssembler assembler) {

        this.activityRepository = activityRepository;
        this.assembler = assembler;
    }

    // Get all Activities.
    @GetMapping("/activities")
    public CollectionModel<?> all() {

        // Get all Activities by current user name.
        // Assemble their models.
        List<EntityModel<Activity>> activities = activityRepository.findByOwnerUsername(CurrentUserUsername.get(),
                Sort.by(Sort.Direction.ASC, "date", "timeStart", "statusActive")).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(activities,
                linkTo(methodOn(ActivityController.class).all()).withSelfRel());
    }

    // Create a new Activity.
    @PostMapping("/activities")
    ResponseEntity<?> newActivity(@Valid @RequestBody Activity newActivity) {

        newActivity.setOwnerUsername(CurrentUserUsername.get());

        EntityModel<Activity> entityModel = assembler.toModel(activityRepository.save(newActivity));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Get one Activity by id.
    @GetMapping("/activities/{id}")
    public EntityModel<Activity> one(@PathVariable UUID id) {

        ActivityFinder finder = new ActivityFinder(id, activityRepository);

        Activity activity = finder.get(ActivityFinder.Access.OWNER);

        return assembler.toModel(activity);
    }

    // Update an Activity with id.
    @PutMapping("/activities/{id}")
    ResponseEntity<?> replaceActivity(@Valid @RequestBody Activity newActivity, @PathVariable UUID id) {

        ActivityFinder finder = new ActivityFinder(id, activityRepository);

        Activity activity = finder.get(ActivityFinder.Access.OWNER);

        // Update activity attributes.
        activity.setName(newActivity.getName());
        activity.setTimeEnd(newActivity.getTimeStart());
        activity.setTimeEnd(newActivity.getTimeEnd());
        activity.setDescription(newActivity.getDescription());
        activity.setDate(newActivity.getDate());
        activity.setRepeatWeekly(newActivity.isRepeatWeekly());
        activity.setStatusActive(newActivity.isStatusActive());

        activityRepository.save(activity);

        EntityModel<Activity> entityModel = assembler.toModel(activity);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Delete an Activity.
    @DeleteMapping("/activities/{id}")
    ResponseEntity<?> deleteActivity(@PathVariable UUID id) {

        ActivityFinder finder = new ActivityFinder(id, activityRepository);

        Activity activity = finder.get(ActivityFinder.Access.OWNER);

        activityRepository.delete(activity);

        return ResponseEntity.noContent().build();
    }

    // Get Activities from Pollub.
    @GetMapping("/activities/pollub")
    void addActivitiesFromPollubToUser() {

        PollubParser pollubParser = new PollubParser();
        ArrayList<Subject> subjects = pollubParser.getSubjects();

        // Loop through each Subject.
        for (Subject subject : subjects) {
            // Create Activity from Subject.
            Activity activity = new Activity(CurrentUserUsername.get(),
                    subject.getName(),
                    subject.getClass_() + ", " + subject.getLecturer(),
                    Time.valueOf(subject.getTimeStart() + ":00"),
                    Time.valueOf(subject.getTimeEnd() + ":00"),
                    Date.valueOf(LocalDate.now()),
                    false,
                    true
                    );

            // Save Activity in database.
            activityRepository.save(activity);
        }
    }
}
