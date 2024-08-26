import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'src/app/shared/interfaces/menu-item';

@Component({
  selector: 'app-admin-list-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-list-menu.component.html',
  styleUrl: './admin-list-menu.component.css'
})
export class AdminListMenuComponent {
  menu: MenuItem[] = [
    {text: 'Overview', routerLink: 'admin-overview'},
    {text: 'Departments', routerLink: 'departments'},
    {text: 'Users', routerLink: 'users'},
    {text: 'Requests', routerLink: 'requests'}
  ]

}
