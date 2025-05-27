import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyPdfService } from '../../services/company-pdf.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-company-pdf',
  templateUrl: './company-pdf.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
})
export class CompanyPdfComponent implements OnInit {
  @Input() companyId: number | null = null;
  @Output() fileUploaded = new EventEmitter<void>();

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  pdfUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private companyPdfService: CompanyPdfService,
    private authService: AuthService
  ) {
    this.uploadForm = this.fb.group({
      file: [null],
    });
  }

  ngOnInit(): void {
    this.authService.getCompanyId().subscribe((companyId) => {
      if (companyId) {
        this.companyId = companyId;
        this.loadPdf();
      } else {
        console.error('No company ID found for the logged-in user');
      }
    });
  }

  loadPdf(): void {
    if (this.companyId) {
      this.companyPdfService.downloadCompanyPdfTest(this.companyId).subscribe({
        next: (response) => {
          if (this.pdfUrl) {
            URL.revokeObjectURL(this.pdfUrl); // Release any previous URL
          }
          this.pdfUrl = URL.createObjectURL(response);
        },
        error: (error) => {
          console.error('Error loading PDF', error);
        },
      });
    }
  }

  onViewPdf(): void {
    if (this.pdfUrl) {
      window.open(this.pdfUrl);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files ? input.files[0] : null;
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      alert('Please select a valid PDF file.');
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.companyId) {
      this.companyPdfService
        .uploadCompanyPdf(this.companyId, this.selectedFile)
        .subscribe({
          next: () => {
            console.log('File uploaded successfully');
            this.fileUploaded.emit();
            this.loadPdf(); // Reload to show the updated PDF
          },
          error: (error) => {
            console.error('Error uploading file', error);
          },
        });
    }
  }

  onRemove(): void {
    this.selectedFile = null;
  }

  onDelete(): void {
    if (this.companyId) {
      this.companyPdfService.deleteCompanyPdf(this.companyId).subscribe({
        next: () => {
          console.log('File deleted successfully');
          this.fileUploaded.emit();
          if (this.pdfUrl) {
            URL.revokeObjectURL(this.pdfUrl); // Release the URL
          }
          this.pdfUrl = null; // Clear the PDF URL after deletion
        },
        error: (error) => {
          console.error('Error deleting file', error);
        },
      });
    }
  }
  onDownloadReport(year: number): void {
    if (this.companyId) {
      this.companyPdfService
        .downloadCompanyReport(this.companyId, year)
        .subscribe({
          next: (response) => {
            const url = window.URL.createObjectURL(response);
            window.open(url);
            URL.revokeObjectURL(url); // Release URL after use
          },
          error: (error) => {
            console.error('Error downloading file', error);
          },
        });
    }
  }
  onDownloadTest(): void {
    if (this.companyId) {
      this.companyPdfService.downloadCompanyPdfTest(this.companyId).subscribe({
        next: (response) => {
          const url = window.URL.createObjectURL(response);
          window.open(url);
          URL.revokeObjectURL(url); // Release URL after use
        },
        error: (error) => {
          console.error('Error downloading file', error);
        },
      });
    }
  }
}
