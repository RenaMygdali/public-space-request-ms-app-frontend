import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'src/app/shared/interfaces/menu-item';

@Component({
  selector: 'app-officer-list-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './officer-list-menu.component.html',
  styleUrl: './officer-list-menu.component.css'
})
export class OfficerListMenuComponent {
  menu: MenuItem[] = [
    {text: 'Overview', routerLink: 'officer-overview'},
    {text: 'Requests', routerLink: 'officer-requests'},
    {text: 'Departments', routerLink: 'officer-departments'},
    {text: 'Settings', routerLink: 'officer-settings'}
  ]
}
