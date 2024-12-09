import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PlayerService } from '../services/player.service';
import { CoachService } from '../services/coach.service';

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
    private authService: AuthService,
    private playerService: PlayerService,
    private coachService: CoachService
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
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          const role = sessionStorage.getItem('role');
          
          if (role === 'PLAYER') {
            this.playerService.getPlayerId(this.email).subscribe({
              next: (playerId) => {
                console.log('Fetched Player ID:', playerId);
                sessionStorage.setItem('playerId', playerId.toString());
                this.router.navigate(['/player-dashboard']);
              },
              error: (error) => {
                console.error('Error fetching player ID:', error);
                alert('Error fetching player details.');
              }
            });
          } else if (role === 'COACH') {
            this.coachService.getCoachId(this.email).subscribe({
              next: (coachId) => {
                console.log('Fetched Coach ID:', coachId);
                sessionStorage.setItem('coachId', coachId.toString());
                this.router.navigate(['/coach-dashboard']);
              },
              error: (error) => {
                console.error('Error fetching coach ID:', error);
                alert('Error fetching coach details.');
              }
            });
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Invalid email or password.');
        }
      });
    }
  }
}
