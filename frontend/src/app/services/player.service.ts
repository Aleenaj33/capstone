// src/app/services/player.service.ts

import { Observable } from "rxjs";
import { PlayerPerformanceReport } from "../models/playerperformancereport";
import { PlayerPerformance } from "../models/playerperformance";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Player } from "../models/player";
import { TrainingSession } from "../models/training-session";
import { PlayerGoal } from "../models/playergoal";
import { Coach } from "../models/coach";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = `${environment.apiBaseUrl}/api/athletes`;

  constructor(private http: HttpClient) {}

  //add player to the form
  createPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(`${this.apiUrl}/players`, player);
  }

  getPlayerById(playerId: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/players/${playerId}`);
  }

  getTeamByPlayerId(playerId: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players/${playerId}/team-members`);
  }

  getTrainingSessionsByPlayerId(playerId: number): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/training-sessions/player/${playerId}`);
  }

  getGoalsByPlayerId(playerId: number): Observable<PlayerGoal[]> {
    return this.http.get<PlayerGoal[]>(`${this.apiUrl}/player/${playerId}/goals`);
  }

  // Get Player Performance Metrics by Player ID
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

  // Get Team Average Performance Report by Player ID
  getTeamAveragePerformanceReport(playerId: number): Observable<PlayerPerformanceReport> {
    return this.http.get<PlayerPerformanceReport>(`${this.apiUrl}/player/${playerId}/team-average-performance`);
  }
  getCoachForPlayer(playerId: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/${playerId}/coach`);
  }

  //
  //
  //
  
  }
  
 


