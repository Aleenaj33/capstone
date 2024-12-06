export interface TrainingSession {
  sessionId?: number;
  coachId: number;
  teamId?: number;
  date: string;
  duration: string;
  playerIds: number[];
  playernames?: string[];
}
