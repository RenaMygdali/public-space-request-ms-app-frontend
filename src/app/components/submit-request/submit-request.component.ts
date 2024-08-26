import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestSubmitDTO } from 'src/app/shared/interfaces/requests';
import { RequestService } from 'src/app/shared/services/request.service';

@Component({
  selector: 'app-submit-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './submit-request.component.html',
  styleUrl: './submit-request.component.css'
})
export class SubmitRequestComponent implements OnInit {
  requestService = inject(RequestService);
  router = inject(Router);

  requestForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(1000)])
  });

  showSuccessMessage: boolean = false;
  showFailureMessage: boolean = false;

  ngOnInit(): void {}

  get title() {
    return this.requestForm.get('title');
  }

  get description() {
    return this.requestForm.get('description');
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      console.log('Request form is valid');   // debugging
      const request = this.requestForm.value as RequestSubmitDTO;
      console.log('Request will be submitted with value', request);   // debugging
      this.requestService.addRequest(request).subscribe({
        next: (response) => {
          console.log('Request submitted successfully!', response);
          this.requestForm.reset(); // Επαναφορά της φόρμας μετά την επιτυχή υποβολή
          this.showSuccessMessage = true;
        },
        error: (errorResponse) => {
          const message = errorResponse.error?.Errors || errorResponse.error?.Message || errorResponse.statusText || "Unknown error";
          console.error('Error submitting request:', message);
          this.showSuccessMessage = false;
          this.showFailureMessage = true;
        }
      });
    } else {
      this.requestForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.showSuccessMessage = false;
  }
}
  
