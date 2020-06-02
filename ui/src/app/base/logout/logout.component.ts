import { Component, OnInit } from '@angular/core'
import {AuthenticationService} from '@app/_services'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.logout()
  }

  ngOnInit(): void {
  }

}
