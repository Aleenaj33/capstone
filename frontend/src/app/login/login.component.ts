import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  // Check if form is valid
  get isFormValid(): boolean {
    return (
      this.email !== '' &&
      this.password !== ''
    );
  }

  // Handle login submission
  onLoginSubmit(form: NgForm): void {
    if (this.isFormValid) {
      const credentials = { email: this.email, password: this.password };
      this.authService.login(credentials).subscribe(
        (response) => {
          // Successfully logged in, redirect based on role
          console.log('Login successful:', response);
          const role = sessionStorage.getItem('role');
          if (role === 'player') {
            this.router.navigate(['/player-dashboard']);
          } else if (role === 'coach') {
            this.router.navigate(['/coach-dashboard']);
          }
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Invalid email or password.');
        }
      );
    }
  }
}
