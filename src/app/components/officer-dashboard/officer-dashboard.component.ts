import { Component, inject, OnInit } from '@angular/core';
import { OfficerListMenuComponent } from '../officer-list-menu/officer-list-menu.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    OfficerListMenuComponent
  ],
  templateUrl: './officer-dashboard.component.html',
  styleUrl: './officer-dashboard.component.css'
})
export class OfficerDashboardComponent  implements OnInit {
  userServise = inject(UserService);

  username: string | null = null;

  ngOnInit(): void {
    this.username = this.userServise.getUsername();
  }

}
