import { Component, ErrorHandler, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RolesService } from 'src/app/shared/services/roles.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserSignupData } from 'src/app/shared/interfaces/user';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/interfaces/departments';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  rolesService = inject(RolesService);
  userService = inject(UserService);
  departmentService = inject(DepartmentService);

  roles: string[] = [];
  departments: Department[] = [];
  departmentMap: { [title: string]: number } = {};
  showDepartment: boolean = false; // Για έλεγχο αν το πεδίο department πρέπει να είναι ενεργό

  registrationStatus: { success: boolean; message: string } = {
    success: false,
    message: 'Not attempted yet'
  };

  showSuccessMessage: boolean = false;  

  signupForm = new FormGroup(
    {
      firstname: new FormControl('',  Validators.maxLength(50)),
      lastname: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.     maxLength(100)]),
      phoneNumber: new FormControl('',  [Validators.pattern(/^[0-9]{10,15}$/),Validators.maxLength(15) ]),
      usernameSignup: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      passwordSignup: new FormControl('', [Validators.required,Validators.minLength(8),Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/)]),
      confirmPasswordSignup: new FormControl('', [Validators.required]),
      role: new FormControl('', Validators.required),
      department: new FormControl({ value: '', disabled: true })
  }, 
  this.passwordConfirmValidator
);


  ngOnInit(): void {
    // Getting roles
    this.rolesService.getRoles().subscribe({
      next: (roles: string[]) => {
        this.roles = roles;
        console.log('Roles:', this.roles); // Βοηθητικό για debugging
      },
      error: (error) => {
        console.error('Error fetching roles', error.message);
        console.error('Error response:', error.error);
      }
    });

    // Getting departments
    this.departmentService.getAllDepartments().subscribe({
      next: (departments: Department[]) => {
        this.departments = departments;
        this.departmentMap = departments.reduce((map, dept) => {
          map[dept.title] = dept.id;
          return map;
        }, {} as { [title: string]: number });
      },
      error: (errorResponse) => {
        console.error('Error fetching departments', errorResponse.message);
        console.error('Error response:', errorResponse.error);
      }
    });

    this.signupForm.get('role')?.valueChanges.subscribe(value => {
      console.log('Selected role:', value); // Βοηθητικό για debugging
      this.showDepartment = value === 'Officer';

      // Εάν ο ρόλος είναι Officer, ενεργοποιούμε το πεδίο department
      const departmentControl = this.signupForm.get('department')
      console.log("Department enabled", departmentControl)
      console.log("Department enabled with value", value)
      
      if (this.showDepartment) {
        departmentControl?.enable();
        departmentControl?.setValidators([Validators.required, Validators.maxLength(50)]);
      } else {
        departmentControl?.disable();
        departmentControl?.clearValidators();
      }
      departmentControl?.updateValueAndValidity();
    });
  }

  passwordConfirmValidator(form: FormGroup) {
    const password = form.get('passwordSignup').value;
    const confirmPassword = form.get('confirmPasswordSignup').value;
    
    if (password !== confirmPassword) {
      form.get('confirmPasswordSignup')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }


  checkDuplicateEmail() {
    const email = this.signupForm.get('email')?.value;

    if (!email) {
      return;
    }

    this.userService.check_duplicate_email(email).subscribe({
      next: (response) => {
        console.log(response.msg);
        this.signupForm.get('email')?.setErrors(null);
      },
      error: (errorResponse) => {
        let message = "An unexpected error occurred.";

        switch (errorResponse.status) {
          case 409:
            message = errorResponse.error.msg || "Email already exists.";
            break;
          case 500:
            message = errorResponse.error.msg || "An error occurred while checking email.";
            break;
        }

        console.error("Error in checking email:", message);
        this.signupForm.get('email')?.setErrors({duplicateEmail: true});
      }
    });
  }


  checkDuplicateUsername() {
    const username = this.signupForm.get('usernameSignup')?.value;

    if (!username) {
      return;
    }

    this.userService.check_duplicate_username(username).subscribe({
      next: (response) => {
        console.log(response.msg);
        this.signupForm.get('usernameSignup')?.setErrors(null);
      },
      error: (errorResponse) => {
        let message = "An unexpected error occurred.";

        switch (errorResponse.status) {
          case 409:
            message = errorResponse.error.msg || "Username already exists.";
            break;
          case 500:
            message = errorResponse.error.msg || "An error occurred while checking username.";
            break;
        }

        console.error("Error in checking username:", message);
        this.signupForm.get('usernameSignup')?.setErrors({duplicateUsername: true});
      }
    });
  }


  onSubmit() {
    // Βοηθητικό για debugging
    console.log("Form submitted with value:", this.signupForm.value);

    if (this.signupForm.valid) {
      const roleValue = this.signupForm.get('role')?.value;

      // Role Mapping
      const roleMapping = {
        'Citizen': 0,
        'Officer': 1,
        'Admin': 2 
      }

      // Δημιουργία του αντικειμένου UserData
      const userData: UserSignupData = {
        username: this.signupForm.value.usernameSignup!,
        email: this.signupForm.value.email!,
        password: this.signupForm.value.passwordSignup!,
        firstname: this.signupForm.value.firstname!,
        lastname: this.signupForm.value.lastname!,
        phonenumber: this.signupForm.value.phoneNumber!,
        role: roleMapping[roleValue]
      };

      if (roleValue === 'Officer') {
        const departmentTitle = this.signupForm.get('department')?.value;
        userData.departmentId = this.departmentMap[departmentTitle];
      }

      console.log("User Data being sent to API:", userData);    // Βοηθητικό για debugging

      // Κλήση υπηρεσίας για αποστολή δεδομένων
      this.userService.signupUser(userData).subscribe({
        next: (response) => {
          console.log("User registration succeeded", response.msg);
          this.registrationStatus = { success: true, message: response.msg };
          this.showSuccessMessage = true;

          // Καθαρισμός της φόρμας
          this.signupForm.reset();
          Object.keys(this.signupForm.controls).forEach(key => {
            this.signupForm.get(key)?.setErrors(null);
          });
        },
        error: (errorResponse) => {
          const message = errorResponse.error?.Errors || errorResponse.error?.Message || errorResponse.statusText || "Unknown error";
          console.log("Error in registering user:", message);   // debugging
          this.registrationStatus = { success: false, message };
          this.showSuccessMessage = false;
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  registerAnotherUser() {
    this.showSuccessMessage = false;
    this.registrationStatus = {
      success: false,
      message: 'Not attempted yet'
    };
  }

  get f() {
    return this.signupForm.controls;
  }

  onBlur(event: FocusEvent, controlName: string) {
    const control = this.signupForm.get(controlName);
    if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  }

  onFocus(event: FocusEvent, controlName: string) {
    const control = this.signupForm.get(controlName);
    if (control) {
      control.markAsUntouched({ onlySelf: true });
    }
  }
}
