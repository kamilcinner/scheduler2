import { Component, OnInit } from '@angular/core'
import {Router} from '@angular/router'
import {AuthenticationService} from '@app/_services'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/welcome'])
    }
  }

  ngOnInit(): void {
  }

}
