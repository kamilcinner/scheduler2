import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './base/home';
import { LoginComponent } from './base/login';
import { AuthGuard } from './_helpers';
import {RegisterComponent} from './base/register';
import {TaskListComponent} from './task/task-list';
import {LogoutComponent} from '@app/base/logout';
import {WelcomeComponent} from '@app/base/welcome/welcome.component';
import {TaskDetailComponent} from '@app/task/task-detail';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:taskId', component: TaskDetailComponent, canActivate: [AuthGuard]},

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Otherwise redirect to welcome page.
  { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
