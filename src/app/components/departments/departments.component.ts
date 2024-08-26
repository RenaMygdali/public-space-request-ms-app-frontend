import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { sortBy } from 'lodash';
import { Department } from 'src/app/shared/interfaces/departments';
import { DepartmentService } from 'src/app/shared/services/department.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  departmentService = inject(DepartmentService);

  departments: Department[] = [];
  departmentToEdit: Department | null = null;
  departmentToDelete: Department = null;
  showEditModal: boolean = false;
  showAddSuccessMessage: boolean = false;
  addedDepartmentTitle: string = '';
  showDeleteConfirmationMessage: boolean = false;
  showDeleteSucceessMessage: boolean = false;
  formSubmitted: boolean = false;
  loading: boolean = false;
  error: boolean = false;
  
  filters = {
    title: '',
    minOfficers: null,
    maxOfficers: null,
    minRequests: null,
    maxRequests: null
  };

  // Pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalDepartments: number = 0;
  totalPages: number = 3;

  sortOrder = {
    title: 'none',
    officers: 'none',
    requests: 'none'
  }

  addDepartmentForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });

  editDepartmentForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });

  ngOnInit(): void {
    this.loadDepartments();
  };

  loadDepartments(): void {
    this.loading = true;
    this.error = false;

    this.departmentService.getAllDepartmentsFiltered(this.filters, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.departments = response.departments || [];
        this.totalDepartments = response.totalCount || 0;
        this.loading = false;
        this.totalPages = Math.ceil(this.totalDepartments / this.pageSize);
        console.log('Response:', response);               // debugging
        console.log('Departments:', response.departments);    // debugging
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

  onFilterChange(): void {
    this.pageNumber = 1; // Reset to first page on filter change
    this.loadDepartments();
  };

  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      console.log(`Page number out of range: ${pageNumber}`);
      return;
    }
    console.log(`Navigating to page: ${pageNumber}`);
    this.pageNumber = pageNumber;
    this.loadDepartments();
  };
  
  onAdd() {
    console.log("Department will be added with value:", this.addDepartmentForm.value);
    this.formSubmitted = true;
    if (this.addDepartmentForm.valid) {
      this.departmentService.addDepartment(this.addDepartmentForm.value).subscribe({
        next: (response) => {
          // console.log("Department added successfully", response.msg);     // debugging
          this.departments.push(response);
          this.formSubmitted = false;
          this.addDepartmentForm.reset();

          // Display success add modal
          this.addedDepartmentTitle = response.title;
          this.showAddSuccessMessage = true;
        },
        error: (err) => console.error("Error adding department: ", err)
      });
    } else {
      console.error("Form is invalid");
      this.addDepartmentForm.markAllAsTouched();
    }
  };

  openEditModal(department: Department): void {
    this.departmentToEdit = department;
    this.editDepartmentForm.patchValue({ title: department.title });
    this.showEditModal = true;
  };

  closeEditModal(): void {
    this.showEditModal = false;
    this.addDepartmentForm.reset();
  };

  closeAddSuccessModal(): void {
    this.showAddSuccessMessage = false;
    this.addedDepartmentTitle = '';
  }

  updateDepartmentTitle(): void {
    console.log("Form Valid:", this.editDepartmentForm.valid);
    console.log("Department to edit:", this.departmentToEdit);
    if (this.editDepartmentForm.valid && this.departmentToEdit) {
      const newTitle = this.editDepartmentForm.value.title;
      const id = this.departmentToEdit.id;
      console.log("Department to edit id:", id);

      this.departmentService.updateDepartmentTitle(id, newTitle).subscribe({
        next: () => {
          this.closeEditModal();
          this.loadDepartments(); // Φορτώνει ξανά τα τμήματα μετά την ενημέρωση
        },
        error: (err) => {
          console.error('Error updating department title:', err);
        }
      });
    } else {
      console.error('Form is invalid or departmentToEdit is not set.');
    }
  };

  confirmDelete(department: any): void {
    this.showDeleteConfirmationMessage = true;
    this.departmentToDelete = department;
  };

  cancelDelete(): void {
    this.showDeleteConfirmationMessage = false;
    this.departmentToDelete = null;
  };

  onDelete(): void {
    if (this.departmentToDelete) {
      this.departmentService.deleteDepartment(this.departmentToDelete.id).subscribe(
        response => {
          console.log('Department deleted:', response);
          this.loadDepartments();
          this.showDeleteConfirmationMessage = false;
          this.showDeleteSucceessMessage = true;
        },
        error => {
          console.error('Error deleting department:', error);
        }
      )
    }
  };

  closeDeleteSuccess(): void {
    this.showDeleteSucceessMessage = false;
    this.departmentToDelete = null;
  };

  sortData(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.departments = sortBy(this.departments, sortKey).reverse();
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.departments = sortBy(this.departments, sortKey);
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

  onBlur(event: FocusEvent, controlName: string) {
    const control = this.addDepartmentForm.get(controlName);
    if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  };

  onFocus(event: FocusEvent, controlName: string) {
    this.formSubmitted = false;
    const control = this.addDepartmentForm.get(controlName);
    if (control) {
      control.markAsUntouched({ onlySelf: true });
    }
  }
}
