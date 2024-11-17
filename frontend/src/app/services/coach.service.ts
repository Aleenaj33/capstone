import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team';
import { Coach } from '../models/coach';
import { TrainingSession } from '../models/training-session';
import { PlayerGoal } from '../models/playergoal';
import { PlayerPerformanceReport } from '../models/playerperformancereport';
import { Player } from '../models/player';
import { PlayerPerformance } from '../models/playerperformance';

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
  getPlayerMetrics(playerId: number): Observable<PlayerPerformance[]> {
    return this.http.get<PlayerPerformance[]>(`${this.apiUrl}/player/${playerId}/metrics`);
  }

  // Get Player Performance Reports by Player ID
  getPlayerReports(playerId: number): Observable<PlayerPerformanceReport[]> {
    return this.http.get<PlayerPerformanceReport[]>(`${this.apiUrl}/player/${playerId}/reports`);
  }

  // Get Teammates' Performance Reports by Player ID
  getTeammatesReports(playerId: number): Observable<PlayerPerformanceReport[]> {
    return this.http.get<PlayerPerformanceReport[]>(`${this.apiUrl}/player/${playerId}/teammates-reports`);
  }

  uploadMetrics(playerId: number, metrics: PlayerPerformance): Observable<any> {
    return this.http.post(`${this.apiUrl}/coach/player/${playerId}/metrics`, metrics, { responseType: 'text' });
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
  updateGoal(goalId:number,goal: Partial<PlayerGoal>): Observable<PlayerGoal> {
    return this.http.put<PlayerGoal>(`${this.apiUrl}/goal/{goalId}`, goal);
  }

  getTeamPlayers(teamId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/teams/${teamId}/players`);
  }

  getPlayerDetails(playerId: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${playerId}`);
  }

  deleteTeam(teamId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teams/${teamId}`);
  }

  deleteTrainingSession(sessionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/training-sessions/${sessionId}`);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }

  deleteGoal(goalId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/goals/${goalId}`);
  }

  // Add this method to get player name by ID
  getPlayerName(playerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/players/${playerId}`);
  }
}
