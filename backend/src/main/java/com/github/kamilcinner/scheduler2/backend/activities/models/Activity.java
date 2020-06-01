package com.github.kamilcinner.scheduler2.backend.activities.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.sql.Time;
import java.util.UUID;

@Data
@Entity
public class Activity {

    private @Id @GeneratedValue UUID id;

    // Owner username will be added during Activity creating.
    private String ownerUsername;

    @NotBlank(message = "Activity name is required.")
    @NotNull(message = "Activity name is required.")
    @Size(
            max = 100,
            message = "Name can be up to {max} characters long."
    )
    private String name;

    // Description is optional.
    @Size(
            max = 500,
            message = "Description can be up to {max} characters long."
    )
    private String description = "";

    @NotNull(message = "Activity start time is required.")
    private Time timeStart;

    @NotNull(message = "Activity end time is required.")
    private Time timeEnd;

    @NotNull(message = "Activity date and time is required.")
    private Date date;

    // Status active if true means that the activity will appear in week schedule.
    private boolean statusActive = true;

    // Repeat weekly means that the activity will appear in week schedule in every week based on day of the week.
    // Eg. every Monday.
    private boolean repeatWeekly = false;

    public Activity() {}

    public Activity(String ownerUsername, String name, String description, Time timeStart, Time timeEnd,
                    Date date, boolean statusActive, boolean repeatWeekly) {
        this.ownerUsername = ownerUsername;
        this.name = name;
        this.description = description;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.date = date;
        this.statusActive = statusActive;
        this.repeatWeekly = repeatWeekly;
    }
}
