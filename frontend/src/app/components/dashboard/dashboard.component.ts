import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player';
import { TrainingSession } from 'src/app/models/training-session';
import { PlayerGoal } from 'src/app/models/playergoal';
import { Coach } from 'src/app/models/coach';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { keys } from 'src/environments/keys';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = keys.apikey;

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
  genAi = new GoogleGenerativeAI(apiKey);
  response: string | null = null;
  selectedReport: any = null;

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

  downloadReport(report: any): void {
    // Implement download functionality
    console.log('Downloading report:', report);
  }

  shareReport(report: any): void {
    // Implement share functionality
    console.log('Sharing report:', report);
  }

  getPerformanceClass(level: string): string {
    level = level.toLowerCase();
    if (level.includes('amateur')) return 'amateur';
    if (level.includes('intermediate')) return 'intermediate';
    if (level.includes('professional')) return 'professional';
    return 'amateur';
  }

  model = this.genAi.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 150,
      temperature: 0.7,
    },
  });

  async getSuggestions(report: any) {
    const prompt = `
  Analyze the following performance metrics and remarks of a soccer player. Provide detailed suggestions in clear bullet points on how the player can:
  - Improve their health and soccer skills if their performance is not at the elite level.
  - Achieve elite-level performance if they're close but not there yet.
  - Maintain and excel if they are already performing at an elite level.

  Performance Metrics:
  - HRV: ${report.hrv}
  - Top Speed: ${report.topSpeed} km/h
  - Calories Burned: ${report.caloriesBurned} kcal
  - Passing Accuracy: ${report.passingAccuracy}%
  - Dribbling Success Rate: ${report.dribblingSuccessRate}%
  - Shooting Accuracy: ${report.shootingAccuracy}%
  - Tackling Success Rate: ${report.tacklingSuccessRate}%
  - Crossing Accuracy: ${report.crossingAccuracy}%

  Remarks:
  ${report.remarks}

  Format your response strictly in bullet points with concise suggestions.
  `;

    try {
      const result = await this.model.generateContent(prompt);
      this.response = result.response.text();
    } catch (error) {
      console.error('Error generating suggestions:', error);
      this.response = 'Unable to fetch suggestions. Please try again later.';
    }
  }


  

  async viewDetailedReport(report: any): Promise<void> {
    this.selectedReport = report;
    console.log('Getting suggestions for report:', report);
    try {
      await this.getSuggestions(report.performanceReport);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      this.response = 'Error getting suggestions. Please try again later.';
    }
  }

  closeModal(): void {
    this.response = null;
    this.selectedReport = null;
  }





}