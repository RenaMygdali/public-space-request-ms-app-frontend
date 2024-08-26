import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { sortBy } from 'lodash';
import { Department } from 'src/app/shared/interfaces/departments';
import { Officer } from 'src/app/shared/interfaces/officer';
import { User } from 'src/app/shared/interfaces/user';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { OfficerService } from 'src/app/shared/services/officer.service';
import { RolesService } from 'src/app/shared/services/roles.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  userService = inject(UserService);
  rolesService = inject(RolesService);
  officerService = inject(OfficerService);
  departmentService = inject(DepartmentService);

  users: User[] = [];
  roles: string[] = ['All'];
  departments: Department[] = [];
  departmentMap: { [title: string]: number } = {};
  loading: boolean = false;
  error: boolean = false;
  showEditModal: boolean = false;
  all: string = '';
  officerToAssign: User | null = null;
  showAssignModal: boolean = false;
  showAssignSucceessMessage: boolean = false;

  filters = {
    username: '',
    role: ''
  };

  editUserForm = new FormGroup({
    role: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });

  // Pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalUsers: number = 0;
  totalPages: number = 3;

  sortOrder = {
    username: 'none',
    officers: 'none',
    requests: 'none'
  };

  // Mapping of enum values to strings
  rolesMapping: { [key: string]: string } = {
    '0': 'Citizen',
    '1': 'Officer',
    '2': 'Admin'
  };

  assignOfficerForm = new FormGroup({
    departmentId: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    // Getting roles
    this.rolesService.getRoles().subscribe({
      next: (role: string[]) => {
        this.roles = ['All', ...role];
      },
      error: (errorResponse) => {
        console.error('Error fetching roles', errorResponse.message);
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
        console.log('Departments', departments);
      },
      error: (errorResponse) => {
        console.error('Error fetching departments', errorResponse.message);
        console.error('Error response:', errorResponse.error);
      }
    });
    this.loadUsers();
  };

  onFilterChange(): void {
    this.pageNumber = 1; // Reset to first page on filter change
    this.loadUsers();
  };

  loadUsers(): void {
    this.loading = true;
    this.error = false;

    // Prepare filters
    const filtersToSend = {
      ...this.filters,
      role: this.filters.role === 'All' ? '' : this.filters.role  // Handle "All" case
    };

    this.userService.getAllUsersFiltered(filtersToSend, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.users = response.users || [];
        this.totalUsers = response.totalCount || 0;
        this.loading = false;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
        console.log('Response:', response);               // debugging
        console.log('Total Count:', response.totalCount);   // debugging
        console.log("Total pages:", this.totalPages);   // debugging
      }, 
      error: err => {
        console.error('Error fetching departments:', err);
        this.error = true;
        this.loading = false;
      }
    })
  };

  sortData(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.users = sortBy(this.users, sortKey).reverse();
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.users = sortBy(this.users, sortKey);
    }

    for (let key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key] = 'none';
      }
    }
  };

  sortSign(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      return '↑';
    } else if (this.sortOrder[sortKey] === 'desc') {
      return '↓';
    } else {
      return '';
    }
  };

  // openEditModal(user: User): void {
  //   this.userToEdit = user;
  //   this.editUserForm.patchValue({ role: user.role });
  //   this.showEditModal = true;
  // };

  openAssignModal(user: User): void {
    this.officerToAssign = user;
    this.showAssignModal = true;
  };

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.assignOfficerForm.reset();
  };

  closeAssignSuccess(): void {
    this.showAssignSucceessMessage = false;
    this.officerToAssign = null;
  };

  assignOfficerToDepartment(): void {
    if (this.assignOfficerForm.valid && this.officerToAssign) {
      const departmentId = Number(this.assignOfficerForm.value.departmentId);
      const officerId = this.officerToAssign.id;
  
      this.officerService.assignOfficer(officerId, departmentId).subscribe({
        next: (response: string) => {
          console.log('Server response:', response); // debugging
          this.closeAssignModal();
          this.showAssignSucceessMessage = true;
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error assigning officer:', err);
        }
      });
    } else {
      console.error('Form is invalid or officerToAssign is not set.');
    }
  };

  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      console.log(`Page number out of range: ${pageNumber}`);
      return;
    }
    console.log(`Navigating to page: ${pageNumber}`);
    this.pageNumber = pageNumber;
    this.loadUsers();
  };

}
