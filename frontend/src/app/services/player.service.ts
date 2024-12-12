// src/app/services/player.service.ts

import { Observable, throwError } from "rxjs";

import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Player } from "../models/player";
import { TrainingSession } from "../models/training-session";
import { PlayerGoal } from "../models/playergoal";
import { Coach } from "../models/coach";
import { tap, catchError } from "rxjs/operators";
import { PerformanceReport } from "../models/playerperformancereport";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = `${environment.apiBaseUrl}/api/athletes`;
  private baseUrl = 'http://localhost:8089/api';

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
    const url = `${this.baseUrl}/athletes/training-sessions/player/${playerId}`;
    console.log('Fetching training sessions from:', url);
    
    return this.http.get<TrainingSession[]>(url).pipe(
      tap(data => console.log('Received training sessions:', data)),
      catchError(error => {
        console.error('Error fetching training sessions:', error);
        return throwError(() => error);
      })
    );
  }

  getGoalsByPlayerId(playerId: number): Observable<PlayerGoal[]> {
    return this.http.get<PlayerGoal[]>(`${this.apiUrl}/player/${playerId}/goals`);
  }


  getCoachForPlayer(playerId: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/${playerId}/coach`);
  }
  getPlayerId(email: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/playerid-by-email?email=${email}`);
  }

  
  savePerformanceReport(report: PerformanceReport): Observable<PerformanceReport> {
    const url = `${this.baseUrl}/performance-reports`;  // Full URL path
    return this.http.post<PerformanceReport>(url, report);
  }
  
  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players`);
  }
  
  updatePlayerWeight(playerId: number, weight: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/players/${playerId}/weight`, { weight });
  }



  getReportsWithRemarksByPlayerName(playerName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/performance-reports/player/name/${playerName}/with-remarks`);
  }
  
  }
  
 


