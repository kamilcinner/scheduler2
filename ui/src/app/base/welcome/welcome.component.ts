import { Component, OnInit } from '@angular/core';
import {AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  username;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.username = this.authenticationService.currentUserValue.username;
  }

  ngOnInit(): void {
  }

}
