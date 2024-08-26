import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OfficerDashboardComponent } from './components/officer-dashboard/officer-dashboard.component';
import { CitizenDashboardComponent } from './components/citizen-dashboard/citizen-dashboard.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { UsersComponent } from './components/users/users.component';
import { RequestsComponent } from './components/requests/requests.component';
import { AdminOverviewComponent } from './components/admin-overview/admin-overview.component';
import { SubmitRequestComponent } from './components/submit-request/submit-request.component';
import { MyRequestsComponent } from './components/my-requests/my-requests.component';
import { CitizenSettingsComponent } from './components/citizen-settings/citizen-settings.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { CitizenRoleGuard } from './guards/citizen-role.guard';
import { OfficerOverviewComponent } from './components/officer-overview/officer-overview.component';
import { OfficerSettingsComponent } from './components/officer-settings/officer-settings.component';
import { OfficerRoleGuard } from './guards/officer-role.guard';
import { OfficerRequestsComponent } from './components/officer-requests/officer-requests.component';
import { OfficerDepartmentsComponent } from './components/officer-departments/officer-departments.component';

export const routes: Routes = [
   {path: '', component: HomeComponent},
   {path: 'signup', component: SignupComponent},
   {path: 'login', component: LoginComponent},
   {
      path: 'admin-dashboard', 
      component: AdminDashboardComponent, 
      canActivate: [AuthGuard, AdminRoleGuard],
      children : [
         { path: 'admin-overview', component: AdminOverviewComponent },
         { path: 'departments', component: DepartmentsComponent },
         { path: 'users', component: UsersComponent },
         { path: 'requests', component: RequestsComponent }
   ]},
   {
      path: 'citizen-dashboard', 
      component: CitizenDashboardComponent, 
      canActivate: [AuthGuard, CitizenRoleGuard],
      children : [
         { path: 'submit-request', component: SubmitRequestComponent },
         { path: 'my-requests', component: MyRequestsComponent },
         { path: 'citizen-settings', component: CitizenSettingsComponent }
   ]},
   {
      path: 'officer-dashboard', 
      component: OfficerDashboardComponent, 
      canActivate: [AuthGuard, OfficerRoleGuard],
      children : [
         { path: 'officer-overview', component: OfficerOverviewComponent },
         { path: 'officer-requests', component: OfficerRequestsComponent },
         { path: 'officer-departments', component: OfficerDepartmentsComponent },
         { path: 'officer-settings', component: OfficerSettingsComponent }
   ]},
   {path: '**', redirectTo: '/login'}  // Προαιρετικό, για ανακατεύθυνση σελίδων που δεν βρέθηκαν
];
