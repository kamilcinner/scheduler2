import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component'
import { appRoutingModule } from './app.routing'

import { JwtInterceptor, ErrorInterceptor } from './_helpers'
import { HomeComponent } from './base/home'
import { LoginComponent } from './base/login'
import { RegisterComponent } from './base/register'
import { TaskListComponent } from './task/task-list'
import { TopNavComponent } from './base/top-nav'
import { LogoutComponent } from './base/logout'
import { FooterComponent } from './base/footer'
import { WelcomeComponent } from './base/welcome'
import { TaskFormComponent } from '@app/task/task-form'
import { TaskDetailComponent } from '@app/task/task-detail'
import { PageNotFoundComponent } from './base/page-not-found'
import { TaskConfirmDeleteComponent } from '@app/task/task-confirm-delete'
import { ActivityListComponent } from '@app/activity/activity-list'
import { ActivityDetailComponent } from './activity/activity-detail'
import { ActivityConfirmDeleteComponent } from '@app/activity/activity-confirm-delete'
import { ActivityFormComponent } from '@app/activity/activity-form'
import { WeekScheduleComponent } from '@app/week/week-schedule'
import { PollubComponent } from '@app/activity/pollub'
import { ShoppingListListComponent } from '@app/shopping/shopping-list-list'
import { ShoppingListDetailComponent } from '@app/shopping/shopping-list-detail'
import { ShoppingListConfirmDeleteComponent } from '@app/shopping/shopping-list-confirm-delete'
import { ShoppingListNewFormComponent } from '@app/shopping/shopping-list-new-form'
import { ShoppingListItemsFormComponent } from '@app/shopping/shopping-list-items-form';
import { AboutComponent } from '@app/base/about';
import { OtherProjectsComponent } from '@app/base/other-projects'

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
    ShoppingListConfirmDeleteComponent,
    ShoppingListNewFormComponent,
    ShoppingListItemsFormComponent,
    AboutComponent,
    OtherProjectsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
