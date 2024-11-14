import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coach } from 'src/app/models/coach';
import { Player } from 'src/app/models/player';
import { PlayerGoal } from 'src/app/models/playergoal';
import { PlayerPerformanceReport } from 'src/app/models/playerperformancereport';
import { Team } from 'src/app/models/team';
import { TrainingSession } from 'src/app/models/training-session';
import { CoachService } from 'src/app/services/coach.service';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  coach: Coach | undefined;
  teams: Team[] = [];
  coachId: number =10;
  trainingSessions: TrainingSession[] = [];
  goals: PlayerGoal[] = [];
  teamId: number = 2;
  performanceReports: PlayerPerformanceReport[] = [];
  unassignedPlayers: Player[] = [];
  teamName: string = '';
  sportCategory: string = '';
  playerIds: number[] = [];
  createSessionForm!: FormGroup;
  createGoalForm!: FormGroup;
  updateGoalForm!: FormGroup;
  selectedGoalId!: number;
  selectedTab: string = 'coach'; 
 teamIdC:number=1;

  setSelectedTab(tab: string) {
   
    this.selectedTab = tab;
  }


  playerId: number = 1;
  metricsForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  createTeamForm: FormGroup;

  constructor(private coachService: CoachService,
    private fb: FormBuilder,

  ) {
    this.metricsForm = this.fb.group({
      playerName: ['', Validators.required],
      recordDateTime: ['', Validators.required],
      hrv: [null, [Validators.required, Validators.min(0)]],
      topSpeed: [null, [Validators.required, Validators.min(0)]],
      playerLoad: [null, [Validators.required, Validators.min(0)]],
      totalDistanceCovered: [null, [Validators.required, Validators.min(0)]],
      caloriesBurned: [null, [Validators.required, Validators.min(0)]],
    });
    this.createTeamForm = this.fb.group({
      teamName: ['', Validators.required],
      sportCategory: ['', Validators.required],
      playerIds: [[], Validators.required],  // New field for player IDs
    });
    this.createSessionForm = this.fb.group({
      coachId: [null, Validators.required],
      date: ['', Validators.required],
      duration: ['', Validators.required],
      playerIds: [[], Validators.required]
    });
    this.createGoalForm = this.fb.group({
      playerId: [null, Validators.required],
      coachId: [null, Validators.required],
      goalType: ['', Validators.required],
      goalDescription: ['', Validators.required],
      targetValue: [null, Validators.required],
      deadline: ['', Validators.required]
    });

    this.updateGoalForm = this.fb.group({
      achievedValue: [null],
      status: ['', Validators.required],
      feedbackRemarks: ['']
    });
  }

  ngOnInit(): void {
    this.getCoachInfo();
    this.getCoachTeams();
    this.fetchTrainingSessions();
    this.getGoalsForCoach(); 
    this.getTeamReports();
    this.getUnassignedPlayers();
    
     
  }

  getCoachInfo(): void {
    this.coachService.getCoachDetails(this.coachId).subscribe((data: Coach) => {
      this.coach = data;
    });
  }

  getCoachTeams(): void {
    this.coachService.getTeamsByCoachId(this.coachId).subscribe((teams: Team[]) => {
      this.teams = teams;
    });
  }

  fetchTrainingSessions(): void {
    this.coachService.getTrainingSessionsByCoachId(this.coachId).subscribe( (
      trainingSessions:TrainingSession[]) =>{
      this.trainingSessions=trainingSessions;
      }
    );
  }
  getGoalsForCoach(): void {
    this.coachService.getGoalsForCoach(this.coachId).subscribe(
      (goals: PlayerGoal[]) => {
        this.goals = goals;
      },
      
    );
  }
  getTeamReports(): void {
    this.coachService.getTeamReports(this.teamId).subscribe(
      (reports: PlayerPerformanceReport[]) => {
        this.performanceReports = reports;
      },
      (error) => {
        console.error('Error fetching team performance reports:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.metricsForm.valid) {
      const metrics = {
        id: 0,  // Backend will handle ID (can be set if necessary)
        playerId: this.playerId,
        playerName: this.metricsForm.value.playerName,
        recordDateTime: this.metricsForm.value.recordDateTime,
        hrv: this.metricsForm.value.hrv,
        topSpeed: this.metricsForm.value.topSpeed,
        playerLoad: this.metricsForm.value.playerLoad,
        totalDistanceCovered: this.metricsForm.value.totalDistanceCovered,
        caloriesBurned: this.metricsForm.value.caloriesBurned,
      };

      this.coachService.uploadMetrics(this.playerId, metrics).subscribe(
        response => {
          this.successMessage = 'Metrics uploaded successfully!';
          this.errorMessage = '';
          this.metricsForm.reset(); // Reset form after success
        },
        error => {
          this.errorMessage = 'An error occurred while uploading metrics.';
          this.successMessage = '';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.successMessage = '';
    }
  }


  getUnassignedPlayers(): void {
    this.coachService.getUnassignedPlayers().subscribe(
      (players) => {
        this.unassignedPlayers = players;
      },
      (error) => {
        console.error('Error fetching unassigned players:', error);
      }
    );
  }
  createTeam(): void {
    if (this.createTeamForm.invalid) {
      return;  // If form is invalid, do not submit
    }
  const newTeam: Team = {
    teamId:this.teamIdC,
    name: this.createTeamForm.get('teamName')?.value,
    sportCategory: this.createTeamForm.get('sportCategory')?.value,
    coachId: this.coachId,  // Set coachId dynamically
    playerIds: this.createTeamForm.get('playerIds')?.value,  // Get selected player IDs
  };

  this.coachService.createTeam(newTeam).subscribe(
    (response) => {
      console.log('Team created successfully', response);
      const createdTeam: Team = response;  // Assuming response includes the generated teamId
      console.log('Generated teamId:', createdTeam.teamId);
      this.createTeamForm.reset();  // Reset the form
    },
    (error) => {
      console.error('Error creating team:', error);
    }
  );
}

createSession(): void {
  

  if (this.createSessionForm.valid) {
    const newSession: TrainingSession = { ...this.createSessionForm.value };

    if (typeof newSession.playerIds === 'string') {
      newSession.playerIds = newSession.playerIds.split(',').map(id => parseInt(id.trim(), 10));
    }

   

    this.coachService.createTrainingSession(newSession).subscribe({
      next: (response) => {
        console.log('Training session created successfully', response);
        this.createSessionForm.reset();
      },
      error: (error) => {
        console.error('Error creating training session:', error);
      },
      complete: () => {
        console.log('Training session creation completed');
      }
    });
  }
}







  createGoal(): void {
    if (this.createGoalForm.valid) {
      const newGoal: PlayerGoal = this.createGoalForm.value;
      this.coachService.createGoal(newGoal).subscribe(
        (response) => {
          console.log('Goal created successfully:', response);
          this.createGoalForm.reset();
        },
        (error) => {
          console.error('Error creating goal:', error);
        }
      );
    }
  }

  updateGoal(): void {
    if (this.updateGoalForm.valid && this.selectedGoalId) {
      const updatedGoal: Partial<PlayerGoal> = this.updateGoalForm.value;
      this.coachService.updateGoal(this.selectedGoalId, updatedGoal).subscribe(
        (response) => {
          console.log('Goal updated successfully:', response);
          this.updateGoalForm.reset();
          this.selectedGoalId = 0; // Clear the goal ID after updating
        },
        (error) => {
          console.error('Error updating goal:', error);
        }
      );
    } else {
      console.error('Goal ID is required for updating the goal');
    }
  }

  // Use this method to set the goal ID for updating
  selectGoalToUpdate(goalId: number): void {
    this.selectedGoalId = goalId;
  }
 
}

  
  


