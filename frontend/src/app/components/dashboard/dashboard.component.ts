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
  performanceStandards = [
    {
      name: 'Heart Rate Variability (HRV)',
      elite: '80',
      professional: '40-80',
      amateur: '40'
    },
    {
      name: 'Top Speed (km/h)',
      elite: '40',
      professional: '20-40',
      amateur: '20'
    },
    {
      name: 'Calories Burned',
      elite: '1500',
      professional: '800-1500',
      amateur: '800'
    },
    {
      name: 'Passing Accuracy (%)',
      elite: '85',
      professional: '75-85',
      amateur: '75'
    },
    {
      name: 'Dribbling Success Rate (%)',
      elite: '60',
      professional: '50-60',
      amateur: '50'
    },
    {
      name: 'Shooting Accuracy (%)',
      elite: '55',
      professional: '45-55',
      amateur: '45'
    },
    {
      name: 'Tackling Success Rate (%)',
      elite: '70',
      professional: '60-70',
      amateur: '60'
    },
    {
      name: 'Crossing Accuracy (%)',
      elite: '25',
      professional: '15-25',
      amateur: '15'
    }
  ];

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


  getPerformanceClass(level: string): string {
    level = level.toLowerCase();
    if (level.includes('amateur')) return 'amateur';
    if (level.includes('intermediate')) return 'intermediate';
    if (level.includes('professional')) return 'professional';
    return 'amateur';
  }



  //GEMINI AI START

  model = this.genAi.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 250,
      temperature: 0.7,
    },
  });

  async getSuggestions(report: any): Promise<string> {
//     const prompt = `
// Analyze the performance metrics, physical attributes, and remarks of a soccer player. Provide concise, actionable suggestions under the following categories:

// 1. Health Improvement: Suggest specific strategies to enhance physical fitness based on the player's age, height, and weight.
// 2. Skill Enhancement: If the player’s performance is below the elite level, outline steps to improve soccer skills.
// 3. Elite Preparation: If the player is nearing elite-level performance, recommend strategies to achieve elite status.
// 4. Sustained Excellence: If the player is already performing at an elite level, suggest ways to maintain and excel further.

// Player Details:
// - Age: ${this.player?.age || 'N/A'} years
// - Height: ${this.player?.height || 'N/A'} cm
// - Weight: ${report.weight || 'N/A'} kg

// Performance Metrics:
// - Heart Rate Variability (HRV): ${report.hrv}
// - Top Speed: ${report.topSpeed} km/h
// - Calories Burned: ${report.caloriesBurned} kcal
// - Passing Accuracy: ${report.passingAccuracy}%
// - Dribbling Success Rate: ${report.dribblingSuccessRate}%
// - Shooting Accuracy: ${report.shootingAccuracy}%
// - Tackling Success Rate: ${report.tacklingSuccessRate}%
// - Crossing Accuracy: ${report.crossingAccuracy}%

// Remarks:
// ${report.remarks}

// Output Format:
// Provide the response as a list of short, actionable points (should limit within 200 tokens). Ensure the language is precise, professional, and tailored to the provided details.
// `;
const prompt = `
Analyze the given performance metrics, physical attributes, and remarks of a soccer player. Provide actionable suggestions to improve both health and technical skills. Tailor the suggestions based on the player’s age, height, and weight. Ensure the response is concise and within 200 tokens.

Player Details:
Age: ${this.player?.age} years
Height: ${this.player?.height} cm
Weight: ${report.weight} kg

Performance Metrics:
Heart Rate Variability (HRV): ${report.hrv}
Top Speed: ${report.topSpeed} km/h
Calories Burned: ${report.caloriesBurned} kcal
Passing Accuracy: ${report.passingAccuracy}%
Dribbling Success Rate: ${report.dribblingSuccessRate}%
Shooting Accuracy: ${report.shootingAccuracy}%
Tackling Success Rate: ${report.tacklingSuccessRate}%
Crossing Accuracy: ${report.crossingAccuracy}%

Remarks:
${report.remarks}

Provide a list of detailedsuggestions and diet plans if needed to improve as concise bullet points within 250 tokens,without bold or italic text.
`;




    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw error;
    }
  }

  async toggleSuggestions(report: any): Promise<void> {
    if (report.showSuggestions === undefined) {
      report.showSuggestions = false;
    }
    
    report.showSuggestions = !report.showSuggestions;
    
    if (report.showSuggestions && !report.suggestions) {
      try {
        report.suggestions = await this.getSuggestions(report.performanceReport);
      } catch (error) {
        console.error('Error getting suggestions:', error);
        report.suggestions = 'Error getting suggestions. Please try again later.';
      }
    }
  }

  //GEMINI AI END

notifyEvent() {
  // Implement notification functionality
  console.log('Notification requested for upcoming event');
  // You could show a toast message or implement actual notification logic
  alert('You will be notified when the event registration opens!');
}

toggleStandards(report: any): void {
  // Initialize showStandards if it doesn't exist
  if (report.showStandards === undefined) {
    report.showStandards = false;
  }
  report.showStandards = !report.showStandards;
}

getMetricIcon(metricName: string): string {
  const icons: { [key: string]: string } = {
    'Heart Rate Variability (HRV)': 'fas fa-heartbeat',
    'Top Speed (km/h)': 'fas fa-tachometer-alt',
    'Calories Burned': 'fas fa-fire',
    'Passing Accuracy (%)': 'fas fa-futbol',
    'Dribbling Success Rate (%)': 'fas fa-running',
    'Shooting Accuracy (%)': 'fas fa-bullseye',
    'Tackling Success Rate (%)': 'fas fa-shield-alt',
    'Crossing Accuracy (%)': 'fas fa-crosshairs'
  };
  
  return icons[metricName] || 'fas fa-chart-bar';
}

}