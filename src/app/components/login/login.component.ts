import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserLoginData } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingSpinnerComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit() {
    // Check if user is already logged in
    const token = this.userService.getToken();
    if (token) {
      this.redirectBasedOnRole();
    }
  }

  onLogin() {
    // console.log("Form submitted with value:", this.loginForm.value);  // debugging 
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.isLoading = true;
      const userData = this.loginForm.value as UserLoginData;
      this.userService.loginUser(userData).subscribe({
        next: (response) => {
          // console.log("User login succeeded with response", response);  // debugging

          this.isLoading = false;

          // Αποθήκευση του token και του ρόλου στο session storage
          if (response && response.token && response.role) {
            this.userService.saveUserSession(response.token, response.role, response.username);
      
          this.redirectBasedOnRole();
          } else {
            this.errorMessage = 'Invalid response, please try again';
            this.loginForm.reset();
            console.error("Invalid response", response)  
          }
        },
        error: (errorResponse) => {
          const message = errorResponse.error?.Errors || errorResponse.error?.Message || errorResponse.statusText || "Unknown error";
          this.errorMessage = 'Login failed, please try again';
          this.loginForm.reset();
          console.log("Error in user login:", message);
        }
      })
    } else {
      console.error('Form is invalid');
    }
  }

  private redirectBasedOnRole() {
    const userRole = this.userService.getUserRole();
    if (userRole === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (userRole === 'Officer') {
      this.router.navigate(['/officer-dashboard']);
    } else if (userRole === 'Citizen') {
      this.router.navigate(['/citizen-dashboard']);
    } else {
      console.error('Unknown role:', userRole);
      this.router.navigate(['/login']); // Or any default page
    }
  }
}