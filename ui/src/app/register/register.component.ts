import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegistrationService} from '@app/_services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  errors;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registrationService: RegistrationService,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: '', // Validators.required],
      password: '', // Validators.required],
      email:    '', // Validators.required]
    });
  }

  // Convenience getter for easy access to form fields.
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid.
    if (this.registerForm.invalid) {
      return;
    }

    this.registrationService.register(
      this.f.username.value,
      this.f.password.value,
      this.f.email.value
    ).subscribe(
      _ => this.router.navigate(['/login']),
      errors => this.errors = errors
    );
  }

}
