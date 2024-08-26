import { Component, inject, OnInit } from '@angular/core';
import { CitizenListMenuComponent } from "../citizen-list-menu/citizen-list-menu.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CitizenListMenuComponent,
  ],
  templateUrl: './citizen-dashboard.component.html',
  styleUrl: './citizen-dashboard.component.css'
})
export class CitizenDashboardComponent implements OnInit {
  userServise = inject(UserService);

  username: string | null = null;

  ngOnInit(): void {
    this.username = this.userServise.getUsername();
  }

}
