import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private API_URL = `${environment.apiURL}/Status`

  constructor(private http: HttpClient) { }

  getStatus(): Observable<string[]> {
    return this.http.get<string[]>(this.API_URL);
  }
}
