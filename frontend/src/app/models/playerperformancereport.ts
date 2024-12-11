export class PlayerPerformanceReport {
    playerId!: number;
    playerName!: string;
    reportDate!: string;
    hrvStatus!: string;
    topSpeedStatus!: string;
    playerLoadStatus!: string;
    distanceStatus!: string;
    caloriesStatus!: string;
    
    // Add new properties for averages
    averageHRV?: number;
    averageSpeed?: number;
    averageDistance?: number;
    hrv?: number;
    topSpeed?: number;
    distance?: number;
    
    // Add new properties
    averagePlayerLoad?: number;
    averageCalories?: number;
    playerLoad?: number;
    calories?: number;
}
  