import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './base/home';
import { LoginComponent } from './base/login';
import { RegisterComponent } from './base/register';
import { TaskListComponent } from './task/task-list';
import { TopNavComponent } from './base/top-nav';
import { LogoutComponent } from './base/logout';
import { FooterComponent } from './base/footer';
import { WelcomeComponent } from './base/welcome';
import { TaskFormComponent } from '@app/task/task-form';
import { TaskDetailComponent } from '@app/task/task-detail';
import { PageNotFoundComponent } from './base/page-not-found/page-not-found.component';
import { TaskConfirmDeleteComponent } from '@app/task/task-confirm-delete';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { ActivityDetailComponent } from './activity/activity-detail/activity-detail.component';
import { ActivityConfirmDeleteComponent } from './activity/activity-confirm-delete/activity-confirm-delete.component';
import { ActivityFormComponent } from './activity/activity-form/activity-form.component';
import { WeekScheduleComponent } from './week/week-schedule/week-schedule.component';
import { PollubComponent } from './activity/pollub/pollub.component';
import { ShoppingListListComponent } from './shopping/shopping-list-list/shopping-list-list.component';
import { ShoppingListDetailComponent } from './shopping/shopping-list-detail/shopping-list-detail.component';
import { ShoppingListConfirmDeleteComponent } from './shopping/shopping-list-confirm-delete/shopping-list-confirm-delete.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
  ],
  declarations: [
    AppComponent,
    TopNavComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TaskListComponent,
    LogoutComponent,
    FooterComponent,
    WelcomeComponent,
    TaskFormComponent,
    TaskDetailComponent,
    PageNotFoundComponent,
    TaskConfirmDeleteComponent,
    ActivityListComponent,
    ActivityDetailComponent,
    ActivityConfirmDeleteComponent,
    ActivityFormComponent,
    WeekScheduleComponent,
    PollubComponent,
    ShoppingListListComponent,
    ShoppingListDetailComponent,
    ShoppingListConfirmDeleteComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
