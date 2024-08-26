import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class OfficerRoleGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Check if user has 'citizen' role
    const userRole = this.userService.getUserRole(); 

    if (userRole === 'Officer') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
