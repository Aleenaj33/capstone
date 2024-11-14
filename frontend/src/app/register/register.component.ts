import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { PlayerService } from '../services/player.service';
import { CoachService } from '../services/coach.service'; // Correct import for CoachService
import { Player } from '../models/player';
import { Coach } from '../models/coach';

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
  player: Player = { playerId: 0, name: '', email: '', sport: '', teamId: 0, age: 0, height: 0, weight: 0 };
  coach: Coach = { coachId: 0, name: '', email: '', sport: '', age: 0, teamIds: [0] };

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private coachService: CoachService // Inject CoachService correctly
  ) {}

  // Check if the initial form is valid
  get isFormValid(): boolean {
    return (
      this.password === this.confirmPassword &&
      this.role !== '' &&
      this.email !== '' &&
      this.password !== '' &&
      this.confirmPassword !== ''
    );
  }

  // Handle initial registration form submission
  onRegisterSubmit(form: NgForm): void {
    if (this.isFormValid) {
      this.showRoleForm = true;
    }
  }

  // Handle player creation
  createPlayerForm(playerForm: NgForm): void {
    if (playerForm.valid) {
      this.player.email = this.email; // Assign the initial form email to player
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
      this.coach.email = this.email; // Assign the initial form email to coach
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
