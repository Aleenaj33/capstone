import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';  // Ensure this is a string
  password: string = '';  // Ensure this is a string

  constructor(private router: Router) {}

  onLoginSubmit(form: any) {
    if (form.valid) {
      // Handle the login process here
      console.log('Email:', this.email);
      console.log('Password:', this.password);
    }
  }
}
