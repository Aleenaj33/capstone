
  export interface PlayerPerformance {
    id?: number;  // Make id optional
    playerId: number;
    playerName: string;
    recordDateTime: string;
    hrv: number;
    topSpeed: number;
    playerLoad: number;
    totalDistanceCovered: number;
    caloriesBurned: number;
  }
  
  