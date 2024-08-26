import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userService = inject(UserService);
  router = inject(Router);

  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    // Subscribe to the isLoggedIn$ observable to get updates
    this.subscription.add(
      this.userService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      })
    );
  }

  logout(): void {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
