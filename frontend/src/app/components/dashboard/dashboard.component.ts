import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player';
import { TrainingSession } from 'src/app/models/training-session';
import { PlayerGoal } from 'src/app/models/playergoal';
import { PlayerPerformance } from 'src/app/models/playerperformance';
import { PlayerPerformanceReport } from 'src/app/models/playerperformancereport';
import { Coach } from 'src/app/models/coach';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  playerId: number = 1; // Hardcoded playerId for now
  player: any = {};
  teamMembers: Player[] = [];
  trainingSessions: TrainingSession[] = [];
  playerGoals: PlayerGoal[] = [];
  selectedTab: string = 'player';
  selectedReportOption: string = 'individualMetrics'; // Default option
  playerMetrics: PlayerPerformance[] = [];
  playerReports: PlayerPerformanceReport[] = [];
  teammatesReports: any[] = []; // Changed to generic 'any' to handle specific fields
  //playerNames: string[]|null=null;
  sessions: TrainingSession[] = []; // Initialize as empty array
  playerIds:number[]|null=null;
  coach: any = {};


  constructor(private playerService: PlayerService, private router: Router) {}


  ngOnInit(): void {
    this.loadPlayerData();
    this.loadTeamData();
    this.loadTrainingSessions();
    this.loadPlayerGoals();
    this.loadPlayerMetrics();
    this.loadPlayerReports();
    this.loadTeammatesReports(); // Load teammates' performance reports
    this.loadCoachData();
  }
  setReportOption(option: string): void {
    this.selectedReportOption = option;
  }
  logout() {
    // Implement your logout logic here
    this.router.navigate(['/login']);
  }

  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }

  setSelectedReportOption(option: string): void {
    this.selectedReportOption = option;
  }

  loadPlayerData(): void {
    this.playerService.getPlayerById(this.playerId).subscribe((data) => {
      this.player = data;
    });
  }

  loadTeamData(): void {
    this.playerService.getTeamByPlayerId(this.playerId).subscribe((data) => {
      this.teamMembers = data;
    });
  }

  
  loadTrainingSessions(): void {
    this.playerService.getTrainingSessionsByPlayerId(this.playerId).subscribe((data) => {
      this.trainingSessions = data;
    });
  }
  
  // loadTrainingSessions(): void {
  //   this.playerService.getTrainingSessionsByPlayerId(this.playerId).subscribe((data) => {
  //     this.trainingSessions = data;
  
  //     // Loop through each training session
  //     this.trainingSessions.forEach((session) => {
  //       // Initialize an empty array for player names
  //       session.playerNames = [];
  
  //       // Create an array of observables for all player name fetches
  //       const playerNameRequests = session.playerIds.map((playerId: number) => 
  //         this.playerService.getPlayerNameById(playerId)
  //       );
  
  //       // Wait for all requests to complete
  //       forkJoin(playerNameRequests).subscribe((names: string[]) => {
  //         // Populate the playerNames array with the fetched names
  //         session.playerNames = names;
  //       });
  //     });
  //   });
  // }
  
  
  
  
 
  

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

  loadPlayerMetrics(): void {
    this.playerService.getPlayerMetrics(this.playerId).subscribe(
      (data) => {
        this.playerMetrics = data;
      },
      (error) => {
        console.error('Error loading performance metrics:', error);
      }
    );
  }

  loadPlayerReports(): void {
    this.playerService.getPlayerReports(this.playerId).subscribe(
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
    this.playerService.getTeammatesReports(this.playerId).subscribe(
      (data) => {
        this.teammatesReports = data; // Store teammates' performance reports
      },
      (error) => {
        console.error('Error loading teammates reports:', error);
      }
    );
  }
  loadCoachData(): void {
    this.playerService.getCoachForPlayer(this.playerId).subscribe(
      (data) => {
        this.coach = data;
      },
      (error) => {
        console.error('Error loading coach data:', error);
      }
    );
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
}