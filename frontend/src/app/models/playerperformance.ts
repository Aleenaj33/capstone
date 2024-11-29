export interface PlayerPerformance {
  id?: number;
  playerName:string;
  playerId: number;
  recordDateTime: Date;
  hrv: number;
  topSpeed: number;
  playerLoad: number;
  
  totalDistanceCovered: number;
  caloriesBurned:number;
}

