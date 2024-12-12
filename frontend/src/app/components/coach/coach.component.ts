import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coach } from 'src/app/models/coach';
import { Player } from 'src/app/models/player';
import { PlayerGoal } from 'src/app/models/playergoal';
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
 
  unassignedPlayers: Player[] = [];
  teamName: string = '';
  sportCategory: string = '';
  playerIds: number[] = [];
  createSessionForm!: FormGroup;
  
 
  selectedTab: string = 'profile'; 
  
 
  
 
  

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


  selectedGoal: PlayerGoal | null = null;
  showEditGoalModal = false;

 

  setSelectedTab(tab: string) {
   
    this.selectedTab = tab;
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
      deadline: ['', Validators.required],
      achievedValue: [0],
      status: ['In Progress'],
      feedbackRemarks: ['']
    });
    

  this.weatherForm = this.fb.group({
    date: ['', Validators.required],
    location: ['', Validators.required]
  });


   
   
  }

  ngOnInit(): void {
    const storedCoachId = sessionStorage.getItem('coachId');
    if (storedCoachId) {
      this.coachId = parseInt(storedCoachId, 10);
      
      this.getCoachInfo();
      this.loadTeams();
      this.fetchTrainingSessions();
      this.getGoalsForCoach();
   
      
      
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
  
  


  // Fetch teammates' performance reports
  


  


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
  
    this.coachService.createTeam(newTeam).subscribe({
      next: (response) => {
        console.log('Team created successfully', response);
  
        // Add the new team to the teams array
        this.teams = [...this.teams, response];
        
        // Close the modal
        this.showCreateTeamModal = false;
        
        // Reset the form
        this.createTeamForm.reset();
        
        // Show success message
        this.successMessage = 'Team created successfully!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        
        // Refresh the teams list
        this.loadTeams();
      },
      error: (error) => {
        console.error('Error creating team:', error);
        this.errorMessage = 'Failed to create team. Please try again.';
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }
  
  // Add this method if it doesn't exist
  private loadTeams(): void {
    this.coachService.getTeamsByCoachId(this.coachId).subscribe({
      next: (teams) => {
        this.teams = teams;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.errorMessage = 'Failed to load teams.';
      }
    });
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





// Add these properties


// Add these methods
openCreateTeamModal(): void {
  this.showCreateTeamModal = true;
}

cancelCreateTeam(): void {
  this.showCreateTeamModal = false;
  this.createTeamForm.reset();
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
        this.successMessage = 'Team deleted successfully';
      },
      error: (error) => {
        console.error('Error deleting team:', error);
        this.errorMessage = 'Failed to delete team. Please try again.';
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

showCreateGoalModal = false;













// Add these properties




// Add these properties at the top of your component class
goals: PlayerGoal[] = [];
goalForm: FormGroup;



// Add these methods to your component class






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
  this.selectedSession = session;
  this.showSessionDetailsModal = true;
  this.loadSessionPlayers(session);
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
      next: (response) => {
        // Remove the deleted goal from the local array
        this.goals = this.goals.filter(goal => goal.goalId !== goalId);
        this.successMessage = 'Goal deleted successfully';
        // Refresh the goals list
        this.loadGoals();
      },
      error: (error) => {
        console.error('Error deleting goal:', error);
        this.errorMessage = 'Failed to delete goal. Please try again.';
      }
    });
  }
}



openWeatherCheckModal(date: string): void {
  if (date) {
    // Convert the datetime-local value to yyyy-mm-dd format
    const formattedDate = new Date(date).toISOString().split('T')[0];
    this.weatherForm.patchValue({
      date: formattedDate,
      location: '' // Reset location when opening modal
    });
    this.showWeatherCheckModal = true;
  }
}

checkWeather(): void {
  if (this.weatherForm.valid) {
    const date = this.weatherForm.get('date')?.value;
    const location = this.weatherForm.get('location')?.value;
    
    console.log('Checking weather for:', { date, location }); // Debug log
    
    this.weatherService.getWeather(location, date).subscribe({
      next: (data) => {
        console.log('Weather data received:', data); // Debug log
        this.weatherData = data;
        this.closeWeatherCheckModal(); // Close the check modal
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
        this.errorMessage = 'Failed to fetch weather data. Please try again.';
      }
    });
  } else {
    console.log('Form is invalid:', this.weatherForm.errors); // Debug log
  }
}

closeWeatherCheckModal(): void {
  this.showWeatherCheckModal = false;
  this.weatherForm.reset();
}

closeWeatherResults(): void {
  this.weatherData = null;
}

// Add these properties to the component class
showTeamDetailsModal = false;
selectedTeam1: Team | null = null;
teamPlayers: Player[] = [];

// Add these methods
viewTeamDetails(team: Team): void {
  this.selectedTeam1 = team;
  this.showTeamDetailsModal = true;
  this.loadTeamPlayers(team);
}

closeTeamDetails(): void {
  this.showTeamDetailsModal = false;
  this.selectedTeam1 = null;
  this.teamPlayers = [];
}

loadTeamPlayers(team: Team): void {
  if (team.playerIds && team.playerIds.length > 0) {
    this.coachService.getPlayersByIds(team.playerIds).subscribe({
      next: (players) => {
        this.teamPlayers = players;
      },
      error: (error) => {
        console.error('Error loading team players:', error);
      }
    });
  }
}

// Add these properties to the component class
showSessionDetailsModal = false;
selectedSession: TrainingSession | null = null;
sessionPlayers: Player[] = [];

// Add this method to view session details


// Add this method to load session players
loadSessionPlayers(session: TrainingSession): void {
  if (session.playerIds && session.playerIds.length > 0) {
    this.coachService.getPlayersByIds(session.playerIds).subscribe({
      next: (players) => {
        this.sessionPlayers = players;
      },
      error: (error) => {
        console.error('Error loading session players:', error);
      }
    });
  }
}

// Add this method to close session details
closeSessionDetails(): void {
  this.showSessionDetailsModal = false;
  this.selectedSession = null;
  this.sessionPlayers = [];
}

// Add a map to cache player names
playerNames: Map<number, string> = new Map();

// Add this method
getPlayerName(playerId: number): string {
  // Check cache first
  if (this.playerNames.has(playerId)) {
    return this.playerNames.get(playerId) || 'Unknown Player';
  }

  // If not in cache, fetch from players array
  const player = this.players.find(p => p.playerId === playerId);
  if (player) {
    this.playerNames.set(playerId, player.name);
    return player.name;
  }
  
  return 'Unknown Player';
}
// These properties are already defined above
showSessionPlayersModal = false;
// selectedSession: TrainingSession | null = null; 
// sessionPlayers: Player[] = [];

viewSessionPlayers(session: TrainingSession): void {
  this.selectedSession = session;
  this.showSessionPlayersModal = true;
  this.loadSessionPlayers(session);
}

closeSessionPlayers(): void {
  this.showSessionPlayersModal = false;
  this.selectedSession = null;
  this.sessionPlayers = [];
}

openCreateGoalModal(): void {
  this.showCreateGoalModal = true;
  this.goalForm.reset();
}

closeCreateGoalModal(): void {
  this.showCreateGoalModal = false;
  this.goalForm.reset();
}
createGoal(): void {
  if (this.goalForm.valid) {
    const newGoal: PlayerGoal = {
      ...this.goalForm.value,
      coachId: this.coachId,
      achievedValue: 0,
      status: 'In Progress'
    };

    console.log('Form values:', this.goalForm.value); // Add this for debugging
    console.log('Form validation status:', this.goalForm.valid); // Add this for debugging

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
  } else {
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.goalForm.controls).forEach(key => {
      const control = this.goalForm.get(key);
      control?.markAsTouched();
    });
  }
}

editGoal(goal: PlayerGoal): void {
  this.selectedGoal = goal;
  this.goalForm = this.fb.group({
    achievedValue: [goal.achievedValue, [Validators.required, Validators.min(0)]],
    status: [goal.status, Validators.required],
    feedbackRemarks: [goal.feedbackRemarks]
  });
  this.showEditGoalModal = true;
}

updateGoal(): void {
  if (this.goalForm.valid && this.selectedGoal) {
    const updatedGoal: Partial<PlayerGoal> = {
      ...this.selectedGoal,
      achievedValue: this.goalForm.get('achievedValue')?.value,
      status: this.goalForm.get('status')?.value,
      feedbackRemarks: this.goalForm.get('feedbackRemarks')?.value
    };

    this.coachService.updateGoal(this.selectedGoal.goalId, updatedGoal).subscribe({
      next: (response) => {
        const index = this.goals.findIndex(g => g.goalId === this.selectedGoal?.goalId);
        if (index !== -1) {
          this.goals[index] = { ...this.goals[index], ...response };
        }
        this.showEditGoalModal = false;
        this.selectedGoal = null;
        this.goalForm.reset();
        this.successMessage = 'Goal updated successfully';
        this.loadGoals();
      },
      error: (error) => {
        console.error('Error updating goal:', error);
        this.errorMessage = 'Failed to update goal. Please try again.';
      }
    });
  }
}

closeEditGoalModal(): void {
  this.showEditGoalModal = false;
  this.selectedGoal = null;
  this.goalForm.reset();
}















}  

