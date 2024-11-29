import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PlayerService } from '../services/player.service';
import { CoachService } from '../services/coach.service'; // Correct import for CoachService
import { Player } from '../models/player';
import { Coach } from '../models/coach';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../models/register-dto.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  roles: string = '';
  showRoleForm: boolean = false;
  selectedRole: string = '';

  // Player and Coach objects initialized
  player: Player = { playerId: 0, name: '', email: '', sport: '', teamId: 0, age: 0, height: 0, weight: 0 };
  coach: Coach = { coachId: 0, name: '', email: '', sport: '', age: 0, teamIds: [0] };

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private coachService: CoachService,
    private authService: AuthService // Assuming an AuthService for handling registration
  ) {}

  // Check if the initial form is valid
  get isFormValid(): boolean {
    return (
      this.email !== '' &&
      this.password !== '' &&
      this.confirmPassword !== '' &&
      this.password === this.confirmPassword &&
      this.selectedRole !== ''
    );
  }

  onRegisterSubmit(form: NgForm): void {
    if (this.isFormValid) {
      this.showRoleForm = true;
    }
  }

  // Handle player creation
  createPlayerForm(playerForm: NgForm): void {
    if (playerForm.valid) {
      this.player.email = this.email; // Automatically set email from initial form
      this.playerService.createPlayer(this.player).subscribe(
        () => {
          console.log('Player added successfully');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error saving player:', error);
        }
      );
    }
  }

  // Handle coach creation
  createCoachForm(coachForm: NgForm): void {
    if (coachForm.valid) {
      this.coach.email = this.email; // Automatically set email from initial form
      this.coachService.createCoach(this.coach).subscribe(
        () => {
          console.log('Coach added successfully');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error saving coach:', error);
        }
      );
    }
  }
}