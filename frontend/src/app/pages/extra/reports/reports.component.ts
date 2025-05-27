import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { CompanyPdfService } from '../../../services/company-pdf.service';
import { AuthService } from '../../../services/auth.service';
import { UserService, User } from '../../../services/user.service';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    TablerIconsModule,
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,],
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {

  username: string | null = null;
  user: User | null = null;
  years: number[] = [];
  reportForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private companyService: CompanyService,
    private companyPdfService: CompanyPdfService,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
      year: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.username) {
      this.userService.getUserByUsername(this.username).subscribe((user: User) => {
        this.user = user;
        if (this.user.company_id) {
          this.loadAvailableYears(this.user.company_id);
        }
      });
    }
  }

  loadAvailableYears(companyId: number): void {
    this.companyService.getAvailableYears(companyId).subscribe((years: number[]) => {
      this.years = years;
    });
  }

  onYearSelected(): void {
    const selectedYear = this.reportForm.get('year')?.value;
    if (selectedYear && this.user?.company_id) {
      this.downloadReport(this.user.company_id, selectedYear);
    }
  }

  onYearSelectedPortfolio(): void {
    const selectedYear = this.reportForm.get('year')?.value;
    if (selectedYear && this.user?.company_id) {
      this.router.navigate(['/external/esg-portfolio', selectedYear]);
    }
  }

  downloadReport(companyId: number, year: number): void {
    this.companyPdfService.downloadCompanyReport(companyId, year).subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        window.open(url);
      },
      error: (error) => {
        console.error('Error downloading file', error);
      },
    });
  }

}
