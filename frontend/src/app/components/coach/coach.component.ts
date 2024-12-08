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
import { AuthService } from 'src/app/services/auth.service';
import { WeatherService } from 'src/app/services/weather.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  coach: Coach | undefined;
  teams: Team[] = [];
  coachId: number = 1;
  trainingSessions: TrainingSession[] = [];
//  teamId: number = 1;
//
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
  error!: string;
  showWeatherCheckModal = false;
  weatherForm: FormGroup;
  weatherData: any;

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
    private authService: AuthService,
    private fb: FormBuilder,
    private weatherService: WeatherService,
    private router: Router
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
      date: ['', Validators.required],
      duration: ['', Validators.required],
      playerIds: [[], Validators.required],
      coachId: [this.coachId, Validators.required]
    });
     this.goalForm = this.fb.group({
    playerId: ['', Validators.required],
    goalType: ['', Validators.required],
    goalDescription: ['', Validators.required],
    targetValue: ['', [Validators.required, Validators.min(0)]],
    deadline: ['', Validators.required]
  });
    
  this.weatherForm = this.fb.group({
    date: ['', Validators.required],
    location: ['', Validators.required]
  });

   
   
  }

  ngOnInit(): void {
    // Get coachId from session storage
    const storedCoachId = sessionStorage.getItem('coachId');
    if (storedCoachId) {
      this.coachId = parseInt(storedCoachId, 10);
      
      // Load all data with the retrieved coachId
      this.getCoachInfo();
      this.getCoachTeams();
      this.fetchTrainingSessions();
      this.getGoalsForCoach();
      this.loadPlayerMetrics();
      this.loadPlayerReports();
      this.loadTeammatesReports();
      this.getUnassignedPlayers();
      this.getPlayers();
      this.loadGoals();
    } else {
      console.error('No coach ID found in session');
      this.router.navigate(['/login']);
    }
  }
  private getPlayers(): void {
    this.coachService.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
      },
      error: (error) => {
        console.error('Error fetching players:', error);
      }
    });
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
    const formValue = this.createSessionForm.value;
    
    const newSession: TrainingSession = {
      coachId: this.coachId,
      date: formValue.date,
      duration: formValue.duration,
      playerIds: formValue.playerIds
    };

    this.coachService.createTrainingSession(newSession).subscribe({
      next: (response) => {
        console.log('Training session created successfully', response);
        this.trainingSessions = [...this.trainingSessions, response];
        this.showCreateSessionModal = false;
        this.createSessionForm.reset();
      },
      error: (error) => {
        console.error('Error creating training session:', error);
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
  this.createSessionForm.patchValue({
    coachId: this.coachId
  });
  this.showCreateSessionModal = true;
}

cancelCreateSession(): void {
  this.showCreateSessionModal = false;
  this.createSessionForm.reset();
}



deleteSession(sessionId: number | undefined): void {
  if (!sessionId) {
    console.error('Session ID is undefined');
    return;
  }

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
  return 'Need Attention';
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

getSessionStatus(session: TrainingSession): string {
  const now = new Date().getTime();
  const sessionTime = new Date(session.date).getTime();
  
  if (sessionTime > now) {
    return 'upcoming';
  } else if (sessionTime + this.getDurationInMs(session.duration) > now) {
    return 'in-progress';
  }
  return 'completed';
}

getTeamName(teamId?: number): string {
  if (!teamId) return 'No Team';
  const team = this.teams.find(t => t.teamId === teamId);
  return team ? team.name : 'No Team';
}

getPlayerCount(playerIds: string | number[]): number {
  if (Array.isArray(playerIds)) {
    return playerIds.length;
  }
  // If it's a comma-separated string
  return playerIds ? playerIds.split(',').length : 0;
}

viewSession(session: TrainingSession): void {
  // Implement view session details logic
  console.log('Viewing session:', session);
}

private getDurationInMs(duration: string): number {
  const matches = duration.match(/(\d+)/);
  if (matches) {
    const hours = parseInt(matches[1]);
    return hours * 60 * 60 * 1000;
  }
  return 0;
}

deleteGoal(goalId: number): void {
  if (confirm('Are you sure you want to delete this goal?')) {
    this.coachService.deleteGoal(goalId).subscribe({
      next: () => {
        // Remove the deleted goal from the local array
        this.goals = this.goals.filter(goal => goal.goalId !== goalId);
        this.successMessage = 'Goal deleted successfully';
      },
      error: (error) => {
        console.error('Error deleting goal:', error);
        this.errorMessage = 'Failed to delete goal. Please try again.';
      }
    });
  }
}

getAverageLoad(): number {
  if (!this.playerMetrics.length) return 0;
  return this.playerMetrics.reduce((acc, curr) => acc + curr.playerLoad, 0) / this.playerMetrics.length;
}

getAverageDistance(): number {
  if (!this.playerMetrics.length) return 0;
  return this.playerMetrics.reduce((acc, curr) => acc + curr.totalDistanceCovered, 0) / this.playerMetrics.length;
}

openWeatherCheckModal(date: string): void {
  if (date) {
    // Convert the datetime-local value to yyyy-mm-dd format
    const formattedDate = new Date(date).toISOString().split('T')[0];
    this.weatherForm.patchValue({
      date: formattedDate
    });
    this.showWeatherCheckModal = true;
  }
}


closeWeatherCheckModal(): void {
  this.showWeatherCheckModal = false;
  this.weatherForm.reset();
}

checkWeather(): void {
  if (this.weatherForm.valid) {
    const date = this.weatherForm.get('date')?.value;
    const location = this.weatherForm.get('location')?.value;
    
    this.weatherService.getWeather(location, date).subscribe({
      next: (data) => {
        console.log('Weather data:', data);
        this.weatherData = data;
        this.closeWeatherCheckModal(); // Close the check modal
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
      }
    });
  }
}

closeWeatherResults(): void {
  this.weatherData = null;
}
}  

