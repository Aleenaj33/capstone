export interface TrainingSession {
<<<<<<< HEAD
    sessionId: number;
    coachId: number;
    playerIds: number[];
    date: string;
    duration: string;

    
  }
=======
  sessionId: number;
  coachId: number;
  date: string;
  duration: string;
  playerIds:  string | number[]; // Initially as a comma-separated string or as an array of numbers
}
>>>>>>> c366b13ceb515fe4486dd15a8c5e310b08de3c88
