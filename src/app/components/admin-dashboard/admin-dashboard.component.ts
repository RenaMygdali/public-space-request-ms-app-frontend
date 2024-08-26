import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminListMenuComponent } from '../admin-list-menu/admin-list-menu.component';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AdminListMenuComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  userServise = inject(UserService);

  username: string | null = null;

  ngOnInit(): void {
    this.username = this.userServise.getUsername();
  }
}
