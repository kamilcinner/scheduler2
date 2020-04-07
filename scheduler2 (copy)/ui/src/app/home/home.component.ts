import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users;

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:8080/users/all')
      .subscribe(data => this.users = data);
  }

  ngOnInit(): void {
  }

}
