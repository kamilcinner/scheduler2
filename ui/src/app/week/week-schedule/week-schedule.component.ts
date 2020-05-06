import { Component, OnInit } from '@angular/core';
import { ActivityService, TaskService } from '@app/_services';
import { Quest } from '@app/week/_models';
import { Activity, Task } from '@app/_models';

@Component({
  selector: 'app-week-schedule',
  templateUrl: './week-schedule.component.html',
  styleUrls: ['./week-schedule.component.css']
})
export class WeekScheduleComponent implements OnInit {
  quests: Quest[];

  constructor(
    private taskService: TaskService,
    private activityService: ActivityService,
  ) { }

  ngOnInit(): void {
    // Get Tasks and Activities data from server.

    // Get Tasks.
    let taskList: Task[];
    const resultTasks = this.taskService.getAll();
    if (resultTasks) {
      resultTasks.subscribe(tasks => {
        // Check if there are tasks to display.
        if (tasks) {
          taskList = tasks;
        }
      });
    }

    // Get Activities.
    let activitiesList: Activity[];
    const resultActivities = this.activityService.getAll();
    if (resultActivities) {
      resultActivities.subscribe(activities => {
        // Check if there are activities to display.
        if (activities) {
          activitiesList = activities;
        }
      });
    }

    
  }

}
