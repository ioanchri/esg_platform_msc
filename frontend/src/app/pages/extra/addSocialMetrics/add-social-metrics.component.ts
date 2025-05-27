import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SocialService } from '../../../services/social_metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-add-social-metrics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './add-social-metrics.component.html',
})
export class AddSocialMetricsComponent implements OnInit {
  socialMetricsForm: FormGroup;
  currentDate: Date = new Date();
  metricId: number | null = null;
  companyId: number | null = null;
  isUpdateMode: boolean = false;
  workforceFormGroup: FormGroup;
  trainingFormGroup: FormGroup;
  newHiresTurnoverFormGroup: FormGroup;
  compensationFormGroup: FormGroup;
  year: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private socialService: SocialService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.socialMetricsForm = this.fb.group({
      company_id: ['', Validators.required],
      year: ['', Validators.required],
      created_at: [this.currentDate],
    });

    this.workforceFormGroup = this.fb.group({
      pay_ratio: [null],
      no_of_employees: [null],
      male_employees: [null],
      female_employees: [null],
      permanent_employees: [null],
      temporary_employees: [null],
      full_time_employees: [null],
      part_time_employees: [null],
      employees_under_30: [null],
      employees_30_50: [null],
      employees_over_50: [null],
    });

    this.trainingFormGroup = this.fb.group({
      training_hours: [null],
    });

    this.newHiresTurnoverFormGroup = this.fb.group({
      new_employees: [null],
      employees_left: [null],
      voluntary_turnover: [null],
      involuntary_turnover: [null],
    });

    this.compensationFormGroup = this.fb.group({
      avg_hourly_earnings_male: [null],
      avg_hourly_earnings_female: [null],
      ceo_total_compensation: [null],
      median_employee_total_compensation: [null],
      CEO: [null],
    });
  }

ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    const companyId = params['companyId'];
    const year = params['year'];
    if (companyId && year) {
      this.socialService.getSocialMetricsByCompanyId(companyId).subscribe(metrics => {
        const metric = metrics.find((m: any) => m.year == year);
        if (metric) {
          this.isUpdateMode = true;
          this.metricId = metric.id ?? null;
          if (this.metricId !== null) {
            this.loadMetricData(this.metricId);
          }
        } else {
          this.isUpdateMode = false;
          this.metricId = null;
        }
        this.socialMetricsForm.patchValue({ company_id: companyId, year: year });
      });
    }
  });
}

  loadMetricData(metricId: number): void {
    this.socialService.getSocialMetricById(metricId).subscribe((metric) => {
      this.socialMetricsForm.patchValue(metric);
      this.workforceFormGroup.patchValue(metric);
      this.trainingFormGroup.patchValue(metric);
      this.newHiresTurnoverFormGroup.patchValue(metric);
      this.compensationFormGroup.patchValue(metric);
    });
  }

  onGovernanceMetrics(): void {
    this.onSubmit('/extra/governance_metrics');
  }

  onEnvironmentalMetrics(): void {
    this.onSubmit('/extra/enviromental_metrics');
  }

  onSubmit(nextRoute?: string): void {
    if (this.socialMetricsForm.valid) {
      const socialMetrics = {
        ...this.socialMetricsForm.value,
        ...this.workforceFormGroup.value,
        ...this.trainingFormGroup.value,
        ...this.newHiresTurnoverFormGroup.value,
        ...this.compensationFormGroup.value,
      };
      if (this.metricId) {
        this.socialService
          .updateSocialMetric(this.metricId, socialMetrics)
          .subscribe({
            next: (response) => {
              this.snackBar.open(
                'Social Metrics updated successfully',
                'Close',
                { duration: 3000 }
              );
              if (nextRoute) {
                this.router.navigate([nextRoute], {
                  queryParams: {
                    companyId: response.company_id,
                    year: response.year,
                    metricId: response.id,
                  },
                });
              } else {
                this.router.navigate([`/extra/my-metrics`], {
                  queryParams: { id: this.companyId },
                });
              }
            },
            error: (error) => {
              this.snackBar.open('Failed to update Social Metrics', 'Close', {
                duration: 3000,
              });
            },
          });
      } else {
        this.socialService.createSocialMetric(socialMetrics).subscribe({
          next: (response) => {
            this.snackBar.open('Social Metrics created successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/extra/governance_metrics'], {
              queryParams: {
                companyId: response.company_id,
                year: response.year,
              },
            });
          },
          error: (error) => {
            this.snackBar.open('Failed to create Social Metrics', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    }
  }
}
