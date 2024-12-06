// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RegisterDto } from '../models/register-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/auth'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Login method
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        // Store token and role in session storage
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('role', response.roles); 
         // assuming response includes a single role
        return response;
      }),
      catchError(error => {
        throw new Error('Login failed');
      })
    );
  }


  // Register method
  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerDto).pipe(
      map(response => {
        // Assuming the backend sends a message or data upon successful registration.
        console.log('Registration successful:', response);
        return response; // Returning the response for further use
      }),
      catchError(error => {
        // Handle the error appropriately
        console.log('Registration failed:', error);
        throw new Error('Registration failed: ' + error.message); // Throws the error to be handled upstream
      })
    );
  }
  
  
 

  // Get role of the current user
  getUserRole(): string | null {
    const roles = sessionStorage.getItem('roles');
    return roles ? JSON.parse(roles)[0] : null; // Assuming only one role per user
  }

  getUserEmail(): string | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      return decodedToken?.sub; // Assuming the email is stored in the 'sub' field
    }
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  // Logout method
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
  }

  // Helper to add token to request headers
  getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}

