import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private API_URL = `${environment.apiURL}/Roles`

  constructor(private http: HttpClient) { }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(this.API_URL);
  }
}
