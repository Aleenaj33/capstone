export interface TrainingSession {
  sessionId: number;
  coachId: number;
  date: string;
  duration: string;
  playerIds: string | number[];
  playernames: string[];
}
