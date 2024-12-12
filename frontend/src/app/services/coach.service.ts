import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team';
import { Coach } from '../models/coach';
import { TrainingSession } from '../models/training-session';
import { PlayerGoal } from '../models/playergoal';

import { Player } from '../models/player';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private apiUrl = `${environment.apiBaseUrl}/api/athletes`;

  constructor(private http: HttpClient) {}


  createCoach(coach: Coach): Observable<Coach> {
    return this.http.post<Coach>(`${this.apiUrl}/coaches`, coach);
  }

  getTeamsByCoachId(coachId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/${coachId}/teams`);
  }

  getCoachDetails(coachId: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/coaches/${coachId}`);
  }
  
  getTrainingSessionsByCoachId(coachId: number): Observable<TrainingSession[]> {
    const url = `${this.apiUrl}/training-sessions/coach/${coachId}`;
    return this.http.get<TrainingSession[]>(url);
  }
  getGoalsForCoach(coachId: number): Observable<PlayerGoal[]> {
    const url = `${this.apiUrl}/coach/${coachId}/goals`;  // Backend endpoint URL
    return this.http.get<PlayerGoal[]>(url);
  }
 


  
  getUnassignedPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players/unassigned`);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/createTeams`, team);
  }
  createTrainingSession( session:TrainingSession):Observable<TrainingSession>{
    const url='http://localhost:8089/api/athletes/createTrainingSession';
    return this.http.post<TrainingSession>(url,session);
    
    
  }
  createGoal(goal: PlayerGoal): Observable<PlayerGoal> {
    return this.http.post<PlayerGoal>(`${this.apiUrl}/creategoal`, goal);
  }
  updateGoal(goalId: number, updatedGoal: Partial<PlayerGoal>): Observable<PlayerGoal> {
    return this.http.put<PlayerGoal>(`http://localhost:8089/api/goals/${goalId}`, updatedGoal);
  }

  getTeamPlayers(teamId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/teams/${teamId}/players`);
  }

  getPlayerDetails(playerId: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${playerId}`);
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8089/api/teams/${teamId}`);
  }

  deleteTrainingSession(sessionId: number): Observable<any> {
    return this.http.delete(`http://localhost:8089/api/training-sessions/${sessionId}`);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  deleteGoal(goalId: number): Observable<string> {
    return this.http.delete<string>(`http://localhost:8089/api/goals/${goalId}`);
  }

  // Add this method to get player name by ID
  getPlayerName(playerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/players/${playerId}`);
  }

  removePlayerFromTeam(playerId: number, teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/teams/${teamId}/players/${playerId}`);
  }

  // Add this method to the CoachService class
  getPlayersByTeamId(teamId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/teams/${teamId}/players`);
  }

  getCoachId(email: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/coachid-by-email?email=${email}`);
  }
  
  getPlayersByIds(playerIds: number[]): Observable<Player[]> {
    // Create an array to store all the player observables
    const playerObservables: Observable<Player>[] = playerIds.map(id => 
      this.http.get<Player>(`${this.apiUrl}/players/${id}`)
    );
    
    // Use forkJoin to wait for all requests to complete
    return forkJoin(playerObservables);
  }

 
  
}
