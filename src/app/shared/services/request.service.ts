import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request, RequestSubmitDTO } from '../interfaces/requests';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private API_URL = `${environment.apiURL}/Request`;
  http: HttpClient = inject(HttpClient)

  constructor() { }

  addRequest(request: RequestSubmitDTO): Observable<any> {
    const token = sessionStorage.getItem('authToken');
    // console.log('Token has value', token);    // debugging
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.API_URL}/AddRequest`, request, { headers });
  };


  getAllRequestsFiltered(filters: any, pageNumber: number, pageSize: number): Observable<{ requests: Request[], totalCount: number }> {
    let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());

    for (const key in filters) {
      if (filters[key]) {
          params = params.set(key, filters[key]);
      }
    }

    return this.http.get<{ requests: Request[], totalCount: number }>(`${this.API_URL}/GetAllRequestsWithDetailsFiltered`, { params });
  };

  getUserRequestsFiltered(filters: any, pageNumber: number, pageSize: number): Observable<{ requests: Request[], totalCount: number }> {
    let params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());

    for (const key in filters) {
        if (filters[key]) {
            params = params.set(key, filters[key]);
        }
    }

    const token = sessionStorage.getItem('authToken');
    // console.log('Token has value', token);    //debugging
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ requests: Request[], totalCount: number }>(`${this.API_URL}/GetUserRequests`, { params, headers });
  };

  assignRequest(requestId: number, departmentId: number): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/AssignRequestToDepartment`, { requestId, departmentId }, { responseType: 'text' as 'json' });
  };
}