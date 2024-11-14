import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';
  showRoleForm: boolean = false;

  // Player and Coach objects
  player = { name: '', sport: '', teamId: null, age: null, height: null, weight: null };
  coach = { name: '', sport: '', age: null, email: '' };

  constructor(private router: Router) {}

  // Determine if the form is valid
  get isFormValid(): boolean {
    return this.password === this.confirmPassword && this.role !== '' && this.email !== '' && this.password !== '' && this.confirmPassword !== '';
  }

  // Handle initial registration form submit
  onRegisterSubmit(form: NgForm): void {
    if (this.isFormValid) {
      this.showRoleForm = true;
    }
  }

  // Create Player form
  createPlayerForm(playerForm: NgForm): void {
    if (playerForm.valid) {
      // Save player data logic here (e.g., HTTP request to save data)
      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }

  // Create Coach form
  createCoachForm(coachForm: NgForm): void {
    if (coachForm.valid) {
      // Save coach data logic here (e.g., HTTP request to save data)
      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }
}
