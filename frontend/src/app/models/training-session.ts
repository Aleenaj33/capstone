export interface TrainingSession {
  sessionId?: number;
  coachId: number;
  teamId?: number;
  date: string;
  duration: string;
  playerIds: number[];
  trainingFocus: string;
  playernames?: string[];
}
