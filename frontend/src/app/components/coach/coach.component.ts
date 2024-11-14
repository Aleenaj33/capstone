import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coach } from 'src/app/models/coach';
import { Player } from 'src/app/models/player';
import { PlayerGoal } from 'src/app/models/playergoal';
import { PlayerPerformance } from 'src/app/models/playerperformance';
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
  selectedReportOption: string = 'individualMetrics'; // Default option
  playerMetrics: PlayerPerformance[] = [];
  playerReports: PlayerPerformanceReport[] = [];
  teammatesReports: any[] = [];

 // Store the selected goal ID
  selectedGoal: PlayerGoal | null = null;
 

  setSelectedTab(tab: string) {
   
    this.selectedTab = tab;
  }
  setSelectedReportOption(option: string) {
    this.selectedReportOption = option;
  }


  playerId: number = 1;
  metricsForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  createTeamForm: FormGroup;

  constructor(private coachService: CoachService,
    private fb: FormBuilder,

  ) {
    this.metricsForm = this.fb.group({
      playerName: ['', Validators.required],
      recordDateTime: ['', Validators.required],
      hrv: [null, Validators.required],
      topSpeed: [null, Validators.required],
      playerLoad: [null, Validators.required],
      totalDistanceCovered: [null, Validators.required],
      caloriesBurned: [null, Validators.required],
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
    this.loadPlayerMetrics();
    this.loadPlayerReports();
    this.loadTeammatesReports();
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
  loadPlayerMetrics(): void {
    this.coachService.getPlayerMetrics(this.playerId).subscribe(
      (data) => {
        this.playerMetrics = data;
      },
      (error) => {
        console.error('Error loading performance metrics:', error);
      }
    );
  }

  loadPlayerReports(): void {
    this.coachService.getPlayerReports(this.playerId).subscribe(
      (data) => {
        this.playerReports = data;
      },
      (error) => {
        console.error('Error loading player reports:', error);
      }
    );
  }

  // Fetch teammates' performance reports
  loadTeammatesReports(): void {
    this.coachService.getTeammatesReports(this.playerId).subscribe(
      (data) => {
        this.teammatesReports = data; // Store teammates' performance reports
      },
      (error) => {
        console.error('Error loading teammates reports:', error);
      }
    );
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
      return; // If the form is invalid, do not submit
    }
  
    // Prepare the new team object without setting teamId
    const newTeam: Team = {
      name: this.createTeamForm.get('teamName')?.value,
      sportCategory: this.createTeamForm.get('sportCategory')?.value,
      coachId: this.coachId,  // Set coachId dynamically
      playerIds: this.createTeamForm.get('playerIds')?.value,  // Get selected player IDs
    };
  
    this.coachService.createTeam(newTeam).subscribe(
      (response) => {
        console.log('Team created successfully', response);
  
        // Assume the response includes the newly generated teamId from the backend
        const createdTeam: Team = response;
        console.log('Generated teamId:', createdTeam.teamId);
  
        this.createTeamForm.reset(); // Reset the form after successful submission
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


submitMetricsForm(): void {
  if (this.metricsForm.valid) {
    const metricsData = {
      playerId: this.playerId, // Set dynamically based on selected player
      playerName: this.metricsForm.get('playerName')?.value,
      recordDateTime: this.metricsForm.get('recordDateTime')?.value,
      hrv: this.metricsForm.get('hrv')?.value,
      topSpeed: this.metricsForm.get('topSpeed')?.value,
      playerLoad: this.metricsForm.get('playerLoad')?.value,
      totalDistanceCovered: this.metricsForm.get('totalDistanceCovered')?.value,
      caloriesBurned: this.metricsForm.get('caloriesBurned')?.value,
    };

    this.coachService.uploadMetrics(this.playerId, metricsData).subscribe({
      next: (response) => {
        this.successMessage = 'Metrics uploaded successfully!';
        this.errorMessage = null;
        this.metricsForm.reset();
      },
      error: (error) => {
        this.errorMessage = 'Failed to upload metrics. Please try again.';
        this.successMessage = null;
        console.error('Error uploading metrics:', error);
      }
    });
  }
}



createGoal(): void {
  if (this.createGoalForm.valid) {
    const newGoal = this.createGoalForm.value;
    this.coachService.createGoal(newGoal).subscribe({
      next: () => {
        this.successMessage = 'Goal created successfully!';
        this.createGoalForm.reset();
        this.getGoalsForCoach(); // Refresh the goals list
      },
      error: () => {
        this.errorMessage = 'Error creating goal. Please try again.';
      }
    });
  }
}
onSelectGoal(event: Event): void {
  const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
  if (selectElement) {
    const goalId = Number(selectElement.value); // Get the selected goal ID
    this.selectedGoal = this.goals.find(goal => goal.goalId === goalId) || null;
  }
}


updateGoal(): void {
  if (this.updateGoalForm.valid && this.selectedGoal) {
    const updatedGoal = { ...this.selectedGoal, ...this.updateGoalForm.value };
    const goalId = this.selectedGoal.goalId;

    this.coachService.updateGoal(goalId, updatedGoal).subscribe({
      next: () => {
        this.successMessage = 'Goal updated successfully!';
        this.errorMessage = null;
        this.updateGoalForm.reset();
        this.selectedGoal = null;
        this.getGoalsForCoach();
      },
      error: () => {
        this.errorMessage = 'Error updating goal. Please try again.';
      }
    });
  }
}



}

  
  


