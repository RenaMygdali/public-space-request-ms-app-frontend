import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CitizenRoleGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Check if user has 'citizen' role
    const userRole = this.userService.getUserRole(); // Assumes you have a method to get the user role

    if (userRole === 'Citizen') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
