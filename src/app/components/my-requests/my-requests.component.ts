import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { sortBy } from 'lodash';
import { Request } from 'src/app/shared/interfaces/requests';
import { RequestService } from 'src/app/shared/services/request.service';
import { StatusService } from 'src/app/shared/services/status.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css',
  providers: [DatePipe]
  
})
export class MyRequestsComponent implements OnInit {
  constructor(private datePipe: DatePipe) {}

  requestService = inject(RequestService);
  statusService = inject(StatusService);

  requests: Request[] = [];
  statusList: string[] = [];

  filters = {
    title: '',
    status: ''
  };

  // Pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalRequests: number = 0;
  totalPages: number = 0;

  sortOrder = {
    title: 'none',
    status: 'none'
  }

  loading: boolean = false;
  error: boolean = false;

  // Mapping of enum values to strings
  statusMapping: { [key: string]: string } = {
    '0': 'Pending',
    '1': 'In Progress',
    '2': 'Completed'
  };

  ngOnInit(): void {
    this.statusService.getStatus().subscribe({
      next: (status: string[]) => {
        this.statusList = ['All', ...status];
      },
      error: (errorResponse) => {
        console.error('Error fetching status', errorResponse.message);
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
      status: this.filters.status === 'All' ? '' : this.filters.status
    };

    this.requestService.getUserRequestsFiltered(filtersToSend, this.pageNumber, this.pageSize).subscribe({
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
}
