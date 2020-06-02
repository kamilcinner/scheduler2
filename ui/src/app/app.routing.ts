import { Routes, RouterModule } from '@angular/router'

import { HomeComponent } from './base/home'
import { LoginComponent } from './base/login'
import { AuthGuard } from './_helpers'
import { RegisterComponent } from './base/register'
import { TaskListComponent } from './task/task-list'
import { LogoutComponent } from '@app/base/logout'
import { WelcomeComponent } from '@app/base/welcome'
import { TaskDetailComponent } from './task/task-detail'
import { TaskFormComponent } from '@app/task/task-form'
import { PageNotFoundComponent } from '@app/base/page-not-found'
import { ActivityListComponent } from '@app/activity/activity-list'
import { ActivityDetailComponent } from '@app/activity/activity-detail'
import { ActivityFormComponent } from '@app/activity/activity-form'
import { WeekScheduleComponent } from '@app/week/week-schedule'
import { PollubComponent } from '@app/activity/pollub'
import { ShoppingListListComponent } from '@app/shopping/shopping-list-list'
import { ShoppingListDetailComponent } from '@app/shopping/shopping-list-detail'
import { ShoppingListNewFormComponent } from '@app/shopping/shopping-list-new-form'
import { ShoppingListItemsFormComponent } from '@app/shopping/shopping-list-items-form'
import { AboutComponent } from '@app/base/about';
import { OtherProjectsComponent } from '@app/base/other-projects';

const routes: Routes = [
  // Home.
  { path: '', component: HomeComponent },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },

  // Tasks.
  { path: 'tasks', canActivate: [AuthGuard], children: [
    { path: '', component: TaskListComponent },
    { path: 'new', component: TaskFormComponent },
    { path: 'update/:id', component: TaskFormComponent }
  ]},
  { path: 'tasks/one/:id', component: TaskDetailComponent },

  // Activities.
  { path: 'activities', canActivate: [AuthGuard], children:[
    { path: '', component: ActivityListComponent },
    { path: 'one/:id', component: ActivityDetailComponent },
    { path: 'new', component: ActivityFormComponent },
    { path: 'update/:id', component: ActivityFormComponent },
    { path: 'pollub', component: PollubComponent },
  ]},

  // Shopping lists.
  { path: 'shoppinglists', canActivate: [AuthGuard], children: [
    { path: '', component: ShoppingListListComponent },
    { path: 'new', component: ShoppingListNewFormComponent },
    { path: 'update/:id', component: ShoppingListItemsFormComponent },
  ]},
  { path: 'shoppinglists/one/:id', component: ShoppingListDetailComponent },

  // Week schedule.
  { path: 'week', component: WeekScheduleComponent, canActivate: [AuthGuard] },

  // User authorization and authentication.
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },

  // Others.
  { path: 'about', component: AboutComponent },
  { path: 'other/projects', component: OtherProjectsComponent },

  // Errors.
  { path: '404', component: PageNotFoundComponent },

  // Otherwise redirect to home page.
  { path: '**', redirectTo: '' }
]

export const appRoutingModule = RouterModule.forRoot(routes)
