import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'src/app/shared/interfaces/menu-item';

@Component({
  selector: 'app-citizen-list-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './citizen-list-menu.component.html',
  styleUrl: './citizen-list-menu.component.css'
})
export class CitizenListMenuComponent {
  menu: MenuItem[] = [
    {text: 'Submit a request', routerLink: 'submit-request'},
    {text: 'My Requests', routerLink: 'my-requests'},
    {text: 'Settings', routerLink: 'citizen-settings'}
  ]
}
