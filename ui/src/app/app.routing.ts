import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './base/home';
import { LoginComponent } from './base/login';
import { AuthGuard } from './_helpers';
import { RegisterComponent } from './base/register';
import { TaskListComponent } from './task/task-list';
import { LogoutComponent } from '@app/base/logout';
import { WelcomeComponent } from '@app/base/welcome/welcome.component';
import { TaskDetailComponent } from './task/task-detail';
import { TaskFormComponent } from '@app/task/task-form';
import { PageNotFoundComponent } from '@app/base/page-not-found/page-not-found.component';
import { ActivityListComponent } from '@app/activity/activity-list/activity-list.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },

  { path: 'tasks', canActivate: [AuthGuard], children: [
    { path: '', component: TaskListComponent },
    // { path: 'one/:id', component: TaskDetailComponent },
    { path: 'new', component: TaskFormComponent },
    { path: 'update/:id', component: TaskFormComponent }
  ]},
  { path: 'tasks/one/:id', component: TaskDetailComponent },

  { path: 'activities', canActivate: [AuthGuard], children:[
    { path: '', component: ActivityListComponent },
  ]},

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '404', component: PageNotFoundComponent },

  // Otherwise redirect to home page.
  { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
