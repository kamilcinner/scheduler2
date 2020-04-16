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
import {FooterComponent} from './base/footer';
import { WelcomeComponent } from './base/welcome';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule
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
    TaskDetailComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
