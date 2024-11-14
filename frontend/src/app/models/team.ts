export interface Team {
  teamId?: number;  // Make teamId optional
  name: string;
  sportCategory: string;
  coachId: number;
  playerIds: number[];
}
