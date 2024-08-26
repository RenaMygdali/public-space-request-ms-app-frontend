import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Request } from 'src/app/shared/interfaces/requests';

@Component({
  selector: 'app-request-details-dialog',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './request-details-dialog.component.html',
  styleUrls: ['./request-details-dialog.component.css'],
  providers: [DatePipe]
})
export class RequestDetailsDialogComponent {
  constructor(
    public dialogRef: DialogRef<RequestDetailsDialogComponent>,
    @Inject(DIALOG_DATA) public request: Request,
    private datePipe: DatePipe
  ) {}

  // Mapping of enum values to strings
  statusMapping: { [key: string]: string } = {
    '0': 'Pending',
    '1': 'In Progress',
    '2': 'Completed'
  };

  getFriendlyDate(date: Date | string): string {
    return this.datePipe.transform(date, 'dd MMM yyyy, HH:mm:ss') || '';
  }
}
