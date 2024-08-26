import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Department } from "../interfaces/departments";

@Injectable({
   providedIn: 'root'
 })
 export class DepartmentService {
    private API_URL = `${environment.apiURL}/Department`;
    http: HttpClient = inject(HttpClient)
    router: Router = inject(Router)

    addDepartment(department: any): Observable<any> {
        return this.http.post(`${this.API_URL}/AddDepartment`, department);
    }

    getAllDepartmentsFiltered(filters: any, pageNumber: number, pageSize: number): Observable<{ departments: Department[], totalCount: number }> {
        let params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());

        for (const key in filters) {
        if (filters[key]) {
            params = params.set(key, filters[key]);
        }
        }

        return this.http.get<{ departments: Department[], totalCount: number }>(`${this.API_URL}/GetAllDepartmentsFiltered`, { params });
    }

    
    updateDepartmentTitle(id: number, newTitle: string): Observable<void> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json' 
      });

      return this.http.put<void>(`${this.API_URL}/UpdateDepartmentTitle/${id}`, JSON.stringify(newTitle), { headers });
    }

    deleteDepartment(id: number): Observable<any> {
      return this.http.delete(`${this.API_URL}/DeleteDepartment/${id}`);
    }

    getAllDepartments(): Observable<any> {
      return this.http.get(`${this.API_URL}/GetAllDepartments`);
    }
 }
 