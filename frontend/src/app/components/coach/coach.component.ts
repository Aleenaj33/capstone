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
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  coach: Coach | undefined;
  teams: Team[] = [];
  coachId: number =1;
  trainingSessions: TrainingSession[] = [];
 
  teamId: number = 1;
  performanceReports: PlayerPerformanceReport[] = [];
  unassignedPlayers: Player[] = [];
  teamName: string = '';
  sportCategory: string = '';
  playerIds: number[] = [];
  createSessionForm!: FormGroup;
  
 
  selectedTab: string = 'profile'; 
  selectedReportOption: string = 'individualMetrics'; // Default option
  playerMetrics: PlayerPerformance[] = [];
  playerReports: PlayerPerformanceReport[] = [];
  teammatesReports: any[] = [];
  
 
  
  metricsForm: FormGroup;
  createTeamForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  showCreateSessionModal = false;
  showCreateTeamModal = false;
 

 // Store the selected goal ID

  players: Player[] = [];

  setSelectedTab(tab: string) {
   
    this.selectedTab = tab;
  }
  setSelectedReportOption(option: string) {
    this.selectedReportOption = option;
  }


  playerId: number = 1;

  logout() {
    // Implement your logout logic here
    console.log('Logging out...');
  }

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
     this.goalForm = this.fb.group({
    playerId: ['', Validators.required],
    goalType: ['', Validators.required],
    goalDescription: ['', Validators.required],
    targetValue: ['', [Validators.required, Validators.min(0)]],
    deadline: ['', Validators.required]
  });
    

   
   
  }

  ngOnInit(): void {
    this.getCoachInfo();
    this.getCoachTeams();
    this.fetchTrainingSessions();
  
    this.loadPlayerMetrics();
    this.loadPlayerReports();
    this.loadTeammatesReports();
    this.getUnassignedPlayers();
    this.getPlayers();
    this.loadGoals();
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
  getGoalsForCoach() {
    // ... existing ngOnInit code ...
    
    this.coachService.getGoalsForCoach(this.coachId).subscribe({
      next: (goals) => {
        this.goals = goals;
      },
      error: (error) => {
        console.error('Error fetching goals:', error);
      }
    });
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



// Add these properties


// Add these methods
openCreateTeamModal(): void {
  this.showCreateTeamModal = true;
}

cancelCreateTeam(): void {
  this.showCreateTeamModal = false;
  this.createTeamForm.reset();
}



editTeam(team: Team): void {
  // Implement edit team logic
  console.log('Editing team:', team);
}

deleteTeam(teamId: number | undefined): void {
  if (!teamId) {
    console.error('Team ID is undefined');
    return;
  }

  if (confirm('Are you sure you want to delete this team?')) {
    this.coachService.deleteTeam(teamId).subscribe({
      next: () => {
        this.teams = this.teams.filter(team => team.teamId !== teamId);
      },
      error: (error) => {
        console.error('Error deleting team:', error);
      }
    });
  }
}



openCreateSessionModal(): void {
  this.showCreateSessionModal = true;
}

cancelCreateSession(): void {
  this.showCreateSessionModal = false;
  this.createSessionForm.reset();
}

getPlayerCount(playerIds: string | number[]): number {
  if (Array.isArray(playerIds)) {
    return playerIds.length;
  }
  return playerIds.split(',').length;
}

deleteSession(sessionId: number): void {
  if (confirm('Are you sure you want to delete this session?')) {
    this.coachService.deleteTrainingSession(sessionId).subscribe({
      next: () => {
        this.trainingSessions = this.trainingSessions.filter(
          session => session.sessionId !== sessionId
        );
      },
      error: (error) => {
        console.error('Error deleting session:', error);
      }
    });
  }
}

editSession(session: TrainingSession): void {
  // Implement edit functionality
  console.log('Editing session:', session);
}

showCreateGoalModal = false;










getPlayers(): void {
  this.coachService.getPlayers().subscribe(
    (players: Player[]) => {
      this.players = players;
    },
    (error) => {
      console.error('Error fetching players:', error);
    }
  );
}













// Add these properties
selectedDateRange: string = '7';
selectedTeam: string = '';

// Add these methods
getAverageHRV(): number {
  if (!this.playerMetrics.length) return 0;
  return this.playerMetrics.reduce((acc, curr) => acc + curr.hrv, 0) / this.playerMetrics.length;
}

getAverageTopSpeed(): number {
  if (!this.playerMetrics.length) return 0;
  return this.playerMetrics.reduce((acc, curr) => acc + curr.topSpeed, 0) / this.playerMetrics.length;
}

getAverageCalories(): number {
  if (!this.playerMetrics.length) return 0;
  return this.playerMetrics.reduce((acc, curr) => acc + curr.caloriesBurned, 0) / this.playerMetrics.length;
}

isPositiveTrend(metric: string): boolean {
  // Implement your trend logic here
  return Math.random() > 0.5; // Placeholder implementation
}

getMetricTrend(metric: string): number {
  // Implement your trend calculation logic here
  return Math.floor(Math.random() * 20); // Placeholder implementation
}

exportMetrics(): void {
  // Implement your export logic here
  console.log('Exporting metrics...');
}

isGoodPerformance(metric: PlayerPerformance): boolean {
  // Implement your performance evaluation logic
  return metric.hrv > 70 && metric.topSpeed > 25;
}

isWarningPerformance(metric: PlayerPerformance): boolean {
  // Implement your warning evaluation logic
  return metric.hrv > 50 && metric.hrv <= 70;
}

isPoorPerformance(metric: PlayerPerformance): boolean {
  // Implement your poor performance evaluation logic
  return metric.hrv <= 50;
}

getPerformanceStatus(metric: PlayerPerformance): string {
  if (this.isGoodPerformance(metric)) return 'Good';
  if (this.isWarningPerformance(metric)) return 'Warning';
  return 'Poor';
}

// Add this property
showUploadMetricsModal = false;

// Add these properties at the top of your component class
goals: PlayerGoal[] = [];
goalForm: FormGroup;



// Add these methods to your component class
createGoal(): void {
  if (this.goalForm.valid) {
    const newGoal: PlayerGoal = {
      ...this.goalForm.value,
      coachId: this.coachId,
      achievedValue: 0,
      status: 'In Progress',
      feedbackRemarks: ''
    };

    this.coachService.createGoal(newGoal).subscribe({
      next: (response) => {
        this.loadGoals();
        this.showCreateGoalModal = false;
        this.goalForm.reset();
      },
      error: (error) => {
        console.error('Error creating goal:', error);
      }
    });
  }
}

editGoal(goal: PlayerGoal): void {
  // Implement edit functionality
  console.log('Editing goal:', goal);
}

deleteGoal(goalId: number): void {
  if (confirm('Are you sure you want to delete this goal?')) {
    this.coachService.deleteGoal(goalId).subscribe({
      next: () => {
        this.goals = this.goals.filter(g => g.goalId !== goalId);
      },
      error: (error) => {
        console.error('Error deleting goal:', error);
      }
    });
  }
}

// Add this to your ngOnInit()
loadGoals(): void {
  this.coachService.getGoalsForCoach(this.coachId).subscribe({
    next: (goals) => {
      console.log('Loaded goals:', goals); // Debug log
      this.goals = goals;
    },
    error: (error) => {
      console.error('Error loading goals:', error);
    }
  });
}

  
}  

