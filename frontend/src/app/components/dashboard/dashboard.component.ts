import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player';
import { TrainingSession } from 'src/app/models/training-session';
import { PlayerGoal } from 'src/app/models/playergoal';
import { Coach } from 'src/app/models/coach';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  playerId!: number;
  //playerId: number = 1;
  playerName: string = '';
  player: any = {};
  teamMembers: Player[] = [];
  trainingSessions: TrainingSession[] = [];
  playerGoals: PlayerGoal[] = [];
  coach: Coach | null = null;
  selectedTab: string = 'player';
  selectedReportOption: string = 'individualMetrics';
  error!: string;
  loading: boolean = false;
  performanceReports: any[] = []; // Array to store reports with remarks
  errorMessage: string = '';

  constructor(
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedPlayerId = sessionStorage.getItem('playerId');
    if (storedPlayerId) {
      this.playerId = parseInt(storedPlayerId, 10);
      
      // Load all data with the retrieved playerId
      this.loadPlayerDetails(); // This will now trigger loadReportsWithRemarks after getting player data
      this.loadTeamMembers();
      this.loadTrainingSessions();
      this.loadPlayerGoals();
      this.loadCoachDetails();
    } else {
      console.error('No player ID found in session');
      this.router.navigate(['/login']);
    }
  }

  

  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }

  setSelectedReportOption(option: string): void {
    this.selectedReportOption = option;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  loadPlayerDetails(): void {
    this.playerService.getPlayerById(this.playerId).subscribe({
      next: (data) => {
        this.player = data;
        // Load performance reports after we have the player data
        this.loadReportsWithRemarks();
      },
      error: (error) => {
        console.error('Error loading player details:', error);
      }
    });
  }

  loadTeamMembers(): void {
    this.playerService.getTeamByPlayerId(this.playerId).subscribe((data) => {
      this.teamMembers = data;
    });
  }

  loadTrainingSessions(): void {
    console.log('Loading training sessions for player ID:', this.playerId);
    
    if (!this.playerId) {
      console.error('Invalid player ID');
      return;
    }

    this.playerService.getTrainingSessionsByPlayerId(this.playerId).subscribe({
      next: (data) => {
        console.log('Raw Training Sessions Data:', data); // Debug log
        if (Array.isArray(data)) {
          this.trainingSessions = data;
          console.log('Processed Training Sessions:', this.trainingSessions); // Debug log
        } else {
          console.log('No training sessions found or empty array received');
          this.trainingSessions = [];
        }
      },
      error: (error) => {
        console.error('Error fetching training sessions:', error);
        this.trainingSessions = [];
      }
    });
  }

  loadPlayerGoals(): void {
    this.playerService.getGoalsByPlayerId(this.playerId).subscribe(
      (data) => {
        this.playerGoals = data;
      },
      (error) => {
        console.error('Error loading goals:', error);
      }
    );
  }



 


 

  loadCoachDetails(): void {
    this.loading = true;
    this.playerService.getCoachForPlayer(this.playerId).subscribe({
      next: (data) => {
        this.coach = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading coach data:', error);
        this.coach = null;
        this.loading = false;
      }
    });
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getPlayerIdsArray(playerIds: string | number[]): number[] {
    if (Array.isArray(playerIds)) {
      return playerIds;
    }
    // Convert comma-separated string to array of numbers
    return playerIds.split(',').map(id => parseInt(id.trim(), 10));
  }

  getPlayerIdArray(playerIds: string | number[]): string {
    if (Array.isArray(playerIds)) {
      return playerIds.join(', ');
    }
    return playerIds;
  }
  loadReportsWithRemarks(): void {
    if (this.player?.name) {
      console.log('Loading reports for player:', this.player.name); // Debug log
      this.playerService.getReportsWithRemarksByPlayerName(this.player.name).subscribe({
        next: (data: any[]) => {
          this.performanceReports = data;
          console.log('Loaded performance reports:', this.performanceReports);
        },
        error: (error) => {
          this.errorMessage = 'Error fetching reports: ' + error.message;
          console.error('Error fetching reports:', error);
        }
      });
    } else {
      console.warn('Cannot load reports: Player name is not available');
    }
  }

  extractRemark(remarks: string, metricName: string): string {
    if (!remarks) return '';
    
    const regex = new RegExp(`${metricName}: ([^;]+);`);
    const match = remarks.match(regex);
    return match ? match[1] : '';
  }

  // Add this getter to sort reports by date
  get sortedReports() {
    return [...this.performanceReports].sort((a, b) => {
      const dateA = new Date(a.performanceReport.recordDate);
      const dateB = new Date(b.performanceReport.recordDate);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order (latest first)
    });
  }
}