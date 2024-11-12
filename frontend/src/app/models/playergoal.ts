export interface PlayerGoal {
    goalId: number;
    playerId: number;
    coachId: number;
    goalType: string;
    goalDescription: string;
    targetValue: number;
    achievedValue: number;
    status: string;
    deadline: string;
    feedbackRemarks: string;
  }
  