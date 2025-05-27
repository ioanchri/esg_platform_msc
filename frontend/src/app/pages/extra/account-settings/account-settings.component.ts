import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Company, CompanyService } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';
import { MaterialModule } from '../../../material.module';
import { AppCompaniesTableComponent } from '../companies-table/companies-table.component';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompanyPdfService } from '../../../services/company-pdf.service';
import { CompanyMetricsComponent } from '../company-metrics/company-metrics.component';
import { EnvironmentalService } from '../../../services/enviromental_metrics.service';
import { SocialService } from '../../../services/social_metrics.service';
import { GovernanceService } from '../../../services/governance_metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface YearlyMetrics {
  year: number;
  environmental: any;
  social: any;
  governance: any;
}

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    TablerIconsModule,
    MaterialModule,
    AppCompaniesTableComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CompanyMetricsComponent,
  ],
  templateUrl: './account-settings.component.html',
})
export class AppAccountSettingsComponent implements OnInit {
  company: Company | null = null;
  displayedColumns: string[] = ['name', 'industry', 'contact_email'];
  username: string | null = null;
  user: User | null = null;
  email: string | null = null;
  reportForm: FormGroup;
  passwordForm: FormGroup;

  years: number[] = [];
  yearlyMetrics: YearlyMetrics[] = [];

  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
    private userService: UserService,
    private companyPdfService: CompanyPdfService,
    private fb: FormBuilder,
    private environmentalService: EnvironmentalService,
    private socialService: SocialService,
    private governanceService: GovernanceService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.reportForm = this.fb.group({
      year: [''],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.username) {
      this.userService
        .getUserByUsername(this.username)
        .subscribe((user: User) => {
          this.user = user;
          this.email = user.email;
          if (this.user.company_id) {
            this.loadCompanyDetails(this.user.company_id);
            this.loadAvailableYears(this.user.company_id);
          }
        });
    }
  }

  loadAvailableYears(companyId: number): void {
    this.companyService
      .getAvailableYears(companyId)
      .subscribe((years: number[]) => {
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

  loadCompanyDetails(companyId: number): void {
    this.companyService
      .getCompanyById(companyId)
      .subscribe((company: Company) => {
        this.company = company;
        this.loadMetrics(companyId);
      });
  }

  loadMetrics(companyId: number): void {
    this.environmentalService
      .getEnvironmentalMetricsByCompanyId(companyId)
      .subscribe((envMetrics) => {
        this.socialService
          .getSocialMetricsByCompanyId(companyId)
          .subscribe((socialMetrics) => {
            this.governanceService
              .getGovernanceMetricsByCompanyId(companyId)
              .subscribe((govMetrics) => {
                const years = new Set<number>();
                envMetrics.forEach((metric) => years.add(metric.year));
                socialMetrics.forEach((metric) => years.add(metric.year));
                govMetrics.forEach((metric) => years.add(metric.year));

                this.yearlyMetrics = Array.from(years).map((year) => ({
                  year,
                  environmental: envMetrics.find(
                    (metric) => metric.year === year
                  ),
                  social: socialMetrics.find((metric) => metric.year === year),
                  governance: govMetrics.find((metric) => metric.year === year),
                }));
              });
          });
      });
  }

  onMetricsTabClick(): void {
    if (this.user?.company_id) {
      this.router.navigate(['/extra/company-metrics'], {
        queryParams: { companyId: this.user.company_id },
      });
    }
  }

  passwordMatchValidator(formGroup: FormGroup): any {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword
      ? null
      : { passwordMismatch: true };
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.snackBar.open('Password changed successfully', 'Close', {
            duration: 3000,
          });
          this.passwordForm.reset();
        },
        error: (error) => {
          if (
            error.status === 400 &&
            error.error.detail === 'Invalid credentials'
          ) {
            this.passwordForm
              .get('currentPassword')
              ?.setErrors({ invalid: true });
          } else {
            console.error('Error changing password', error);
            this.snackBar.open('Failed to change password', 'Close', {
              duration: 3000,
            });
          }
        },
      });
    }
  }
}
