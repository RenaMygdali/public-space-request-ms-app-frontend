import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.userService.getToken();
    const isLoginPage = state.url === '/login';

    if (token !== null) {
      // User is logged in
      if (isLoginPage) {
        // Redirect to an appropriate page if the user is logged in and trying to access the login page
        this.redirectLoggedInUser();
        return false;
      }
      // Allow access to other routes if the user is logged in
      return true;
    }

    // User is not logged in
    if (isLoginPage) {
      // Allow access to the login page if not logged in
      return true;
    }

    // Redirect to the login page if the user is not logged in and trying to access protected routes
    this.router.navigate(['/login']);
    return false;
  }

  redirectLoggedInUser(): void {
    // Implement redirection based on user role or default to a dashboard
    const userRole = this.userService.getUserRole();
    if (userRole === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (userRole === 'Officer') {
      this.router.navigate(['/officer-dashboard']);
    } else if (userRole === 'Citizen') {
      this.router.navigate(['/citizen-dashboard']);
    } else {
      this.router.navigate(['/home']); // or any other default page
    }
  }
}
