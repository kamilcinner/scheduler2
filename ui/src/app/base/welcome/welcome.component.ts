import { Component, OnInit } from '@angular/core'
import {AuthenticationService } from '@app/_services'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  username: string

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    // Add username to template.
    this.username = this.authenticationService.currentUserValue.username
  }

  ngOnInit(): void {
  }

}
