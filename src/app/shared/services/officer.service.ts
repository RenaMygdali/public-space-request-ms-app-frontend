import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
   providedIn: 'root'
 })
 export class OfficerService {
  private API_URL = `${environment.apiURL}/Officer`;
  http: HttpClient = inject(HttpClient)

  assignOfficer(userId: number, departmentId: number): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/AssignOfficerToDepartment`, 
      { userId, departmentId }, { responseType: 'text' as 'json' });
  };
 }