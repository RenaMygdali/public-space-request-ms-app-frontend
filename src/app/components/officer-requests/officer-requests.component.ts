import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { sortBy } from 'lodash';
import { Request } from 'src/app/shared/interfaces/requests';
import { RequestService } from 'src/app/shared/services/request.service';
import { StatusService } from 'src/app/shared/services/status.service';
import { RequestDetailsDialogComponent } from '../request-details-dialog/request-details-dialog.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Department } from 'src/app/shared/interfaces/departments';
import { DepartmentService } from 'src/app/shared/services/department.service';

@Component({
  selector: 'app-officer-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ],
  templateUrl: './officer-requests.component.html',
  styleUrl: './officer-requests.component.css',
  providers: [DatePipe]
})
export class OfficerRequestsComponent implements OnInit {
  constructor(private datePipe: DatePipe) {}

  requestService = inject(RequestService);
  departmentService = inject(DepartmentService);
  statusService = inject(StatusService);
  dialog = inject(Dialog);

  requests: Request[] = [];
  departments: Department[] = [];
  statusList: string[] = [];
  departmentMap: { [title: string]: number } = {};
  requestToAssign: Request | null = null;
  showAssignModal: boolean = false;

  filters = {
    status: '',
    title: ''
  };

  // Pagination properties
  pageNumber: number = 1;
  pageSize: number = 8;
  totalRequests: number = 0;
  totalPages: number = 0;

  sortOrder = {
    createDate: 'none',
    username: 'none',
    status: 'none',
    department: 'none'
  }

  loading: boolean = false;
  error: boolean = false;

  // Mapping of enum values to strings
  statusMapping: { [key: string]: string } = {
    '0': 'Pending',
    '1': 'In Progress',
    '2': 'Completed'
  };

  assignRequestForm = new FormGroup({
    departmentId: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    // Getting status
    this.statusService.getStatus().subscribe({
      next: (status: string[]) => {
        this.statusList = ['All', ...status];
      },
      error: (errorResponse) => {
        console.error('Error fetching status', errorResponse.message);
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

    this.loadRequests();
  };

  onFilterChange(): void {
    this.pageNumber = 1; // Reset to first page on filter change
    this.loadRequests();
  };

  loadRequests(): void {
    this.loading = true;
    this.error = false;

    // Prepare filters
    const filtersToSend = {
      ...this.filters,
      status: this.filters.status === 'All' ? '' : this.filters.status  // Handle "All" case
    };

    this.requestService.getAllRequestsFiltered(filtersToSend, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.requests = response.requests || [];
        this.totalRequests = response.totalCount || 0;
        this.loading = false;
        this.totalPages = Math.ceil(this.totalRequests / this.pageSize);
      }, 
      error: err => {
        console.error('Error fetching requests:', err);
        this.error = true;
        this.loading = false;
      }
    })
  };

  openAssignModal(request: Request): void {
    this.requestToAssign = request;
    this.showAssignModal = true;
  };

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.assignRequestForm.reset();
  };

  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      console.log(`Page number out of range: ${pageNumber}`);
      return;
    }
    console.log(`Navigating to page: ${pageNumber}`);
    this.pageNumber = pageNumber;
    this.loadRequests();
  };

  sortData(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.requests = sortBy(this.requests, sortKey).reverse();
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.requests = sortBy(this.requests, sortKey);
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

  getFriendlyDate(date: Date | string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy, HH:mm:ss') || '';
  }

  openRequestDetails(request: Request) {
    this.dialog.open(RequestDetailsDialogComponent, {
      data: request,
    })
  };

  assignRequestToDepartment(): void {
    if (this.assignRequestForm.valid && this.requestToAssign) {
      const departmentId = Number(this.assignRequestForm.value.departmentId);
      const requestId = this.requestToAssign.id;
  
      this.requestService.assignRequest(requestId, departmentId).subscribe({
        next: (response: string) => {
          // console.log('Server response:', response); // debugging
          this.closeAssignModal();
          this.loadRequests(); // Reload requests after assignment
        },
        error: (err) => {
          console.error('Error assigning request:', err);
        }
      });
    } else {
      console.error('Form is invalid or requestToAssign is not set.');
    }
  };
}
