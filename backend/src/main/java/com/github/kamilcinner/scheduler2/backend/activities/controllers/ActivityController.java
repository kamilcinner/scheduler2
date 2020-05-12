package com.github.kamilcinner.scheduler2.backend.activities.controllers;

import com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers.ActivityModelAssembler;
import com.github.kamilcinner.scheduler2.backend.activities.controllers.helpers.ActivityNotFoundException;
import com.github.kamilcinner.scheduler2.backend.addons.PollubParser;
import com.github.kamilcinner.scheduler2.backend.addons.Subject;
import com.github.kamilcinner.scheduler2.backend.users.controllers.helpers.CurrentUserUsername;
import com.github.kamilcinner.scheduler2.backend.activities.models.Activity;
import com.github.kamilcinner.scheduler2.backend.activities.repositories.ActivityRepository;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
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

    // Aggregate root.

    @GetMapping("/activities")
    public CollectionModel<?> all() {
        List<EntityModel<Activity>> activities = activityRepository.findByOwnerUsername(CurrentUserUsername.get(),
                Sort.by(Sort.Direction.ASC, "date", "timeStart", "statusActive")).stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(activities,
                linkTo(methodOn(ActivityController.class).all()).withSelfRel());
    }

    @PostMapping("/activities")
    ResponseEntity<?> newActivity(@Valid @RequestBody Activity newActivity) throws URISyntaxException {
        newActivity.setOwnerUsername(CurrentUserUsername.get());

        EntityModel<Activity> entityModel = assembler.toModel(activityRepository.save(newActivity));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    // Single item.

    @GetMapping("/activities/{id}")
    public EntityModel<Activity> one(@PathVariable UUID id) {

        Activity activity = activityRepository.findById(id)
                .map(searchedActivity -> {
                    if (!searchedActivity.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new ActivityNotFoundException(id);
                    }
                    return searchedActivity;
                })
                .orElseThrow(() -> new ActivityNotFoundException(id));

        return assembler.toModel(activity);
    }

    @PutMapping("/activities/{id}")
    ResponseEntity<?> replaceActivity(@Valid @RequestBody Activity newActivity, @PathVariable UUID id) throws URISyntaxException {

        Activity updatedActivity = activityRepository.findById(id)
                .map(activity -> {
                    if (!activity.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new ActivityNotFoundException(id);
                    }

                    activity.setName(newActivity.getName());
                    activity.setTimeEnd(newActivity.getTimeStart());
                    activity.setTimeEnd(newActivity.getTimeEnd());
                    activity.setDescription(newActivity.getDescription());
                    activity.setDate(newActivity.getDate());
                    activity.setRepeatWeekly(newActivity.isRepeatWeekly());
                    activity.setStatusActive(newActivity.isStatusActive());

                    return activityRepository.save(activity);
                })
                .orElseThrow(() -> new ActivityNotFoundException(id));

        EntityModel<Activity> entityModel = assembler.toModel(updatedActivity);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    @DeleteMapping("/activities/{id}")
    ResponseEntity<?> deleteActivity(@PathVariable UUID id) {

        activityRepository.findById(id)
                .map(activityToDelete -> {
                    if (!activityToDelete.getOwnerUsername().equals(CurrentUserUsername.get())) {
                        throw new ActivityNotFoundException(id);
                    }
                    return activityToDelete;
                })
                .orElseThrow(() -> new ActivityNotFoundException(id));

        activityRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // Get activities from Pollub.
    @GetMapping("/activities/pollub")
    void addActivitiesFromPollubToUser() {
        PollubParser pollubParser = new PollubParser();
        ArrayList<Subject> subjects = pollubParser.getSubjects();

        for (Subject subject : subjects) {
            Activity activity = new Activity(CurrentUserUsername.get(),
                    subject.getName(),
                    subject.getClass_() + ", " + subject.getLecturer(),
                    Time.valueOf(subject.getTimeStart()+":00"),
                    Time.valueOf(subject.getTimeEnd()+":00"),
                    Date.valueOf(LocalDate.now()),
                    false,
                    true
                    );
            activityRepository.save(activity);
        }
    }
}
