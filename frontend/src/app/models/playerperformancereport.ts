export interface PerformanceReportResponse {
  performanceReport: PerformanceReport;
  remarks: string;
}

export class PerformanceReport {
  id?: string;
  playerId!: number;
  height!: number;
  weight!: number;
  playerName!: string;
  recordDate!: string;
  hrv!: number;
  topSpeed!: number;
  caloriesBurned!: number;
  passingAccuracy!: number;
  dribblingSuccessRate!: number;
  shootingAccuracy!: number;
  tacklingSuccessRate!: number;
  crossingAccuracy!: number;
  remarks?: string;
}
