export interface TrainingSession {
 
  sessionId: number;
  coachId: number;
  date: string;
  duration: string;
  playerIds:  string | number[]; // Initially as a comma-separated string or as an array of numbers
}
