import { Component, ErrorHandler } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OfficerDashboardComponent } from './components/officer-dashboard/officer-dashboard.component';
import { CitizenDashboardComponent } from './components/citizen-dashboard/citizen-dashboard.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    RouterOutlet, 
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    AdminDashboardComponent,
    OfficerDashboardComponent,
    CitizenDashboardComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'psm-request-ms';
}
