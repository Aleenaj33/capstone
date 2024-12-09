import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { keys } from '../../environments/keys';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily';
  private apiKey = keys.weatherApiKey; 

  constructor(private http: HttpClient) {}

  getWeather(city: string, date: string): Observable<any> {
    const params = new HttpParams()
      .set('city', city)
      .set('key', this.apiKey);

    return this.http.get(this.baseUrl, { params });
  }
}
