import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '@app/_services';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  get authenticated(): boolean {
    return this.authenticationService.authenticated
  }
}
