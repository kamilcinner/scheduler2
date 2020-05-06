package com.github.kamilcinner.scheduler2.backend.tasks.controllers.helpers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.github.kamilcinner.scheduler2.backend.tasks.models.Task;
import com.github.kamilcinner.scheduler2.backend.tasks.controllers.TaskController;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class TaskModelAssembler implements RepresentationModelAssembler<Task, EntityModel<Task>> {

    @Override
    public EntityModel<Task> toModel(Task task) {

        return new EntityModel<>(task,
                linkTo(methodOn(TaskController.class).one(task.getId())).withSelfRel(),
                linkTo(methodOn(TaskController.class).all()).withRel("tasks"));
    }
}
