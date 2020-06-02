import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { first } from 'rxjs/operators'

import { AuthenticationService } from '@app/_services'

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  returnUrl: string
  submitted = false
  errors

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // Redirect to home if already logged in.
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']).then(
        () => console.warn('User is already logged in!')
      )
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    // Get return url from route parameters or default to '/'.
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/'

    // Check of there is authorization error caused redirection.
    const authenticationError = this.route.snapshot.queryParams.authenticationError
    if (authenticationError) {
      this.errors = { server: authenticationError}
    }
  }

  // Convenience getter for easy access to form fields.
  get f() { return this.loginForm.controls }

  onSubmit() {
    this.loading = true
    this.submitted = true

    // Stop here if form is invalid.
    if (this.loginForm.invalid) {
      this.loading = false
      return
    }

    // Send credentials to API.
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate([this.returnUrl]).then(
            () => console.warn(`User ${this.f.username.value} logged in successfully!`)
          )
        },
        errors => {
          this.errors = errors
          this.loading = false
        }
      )
  }
}
