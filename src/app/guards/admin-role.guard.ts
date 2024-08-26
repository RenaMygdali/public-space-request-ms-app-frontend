import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {}

  canActivate(): boolean {
    // Check if user has 'admin' role
    const userRole = this.userService.getUserRole(); 
    // console.log('User can activate with role', userRole)    //debugging

    if (userRole === 'Admin') {
      return true;
    } else {
      return this.redirectToLogin();
    }
  }

  private redirectToLogin(): boolean {
    this.router.navigate(['/login']);
    return false;
  }
}
