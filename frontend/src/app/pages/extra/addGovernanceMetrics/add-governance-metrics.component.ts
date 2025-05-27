import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovernanceService } from '../../../services/governance_metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-add-governance-metrics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './add-governance-metrics.component.html',
})
export class AddGovernanceMetricsComponent implements OnInit {
  @Output() metricCreated = new EventEmitter<any>();
  governanceMetricsForm: FormGroup;
  currentDate: Date = new Date();
  isUpdateMode: boolean = false;
  metricId: number | null = null;
  companyId: number | null = null;
  year: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private governanceService: GovernanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.governanceMetricsForm = this.fb.group({
      company_id: ['', Validators.required],
      year: ['', Validators.required],
      created_at: [this.currentDate],
      anti_corruption: this.fb.group({
        introduction: [false],
        growth: [false],
        maturity: [false],
        licensed: [false],
      }),
      anti_corruption_text: [''],
      whistleblowing: this.fb.group({
        introduction: [false],
        growth: [false],
        maturity: [false],
        licensed: [false],
      }),
      whistleblowing_text: [''],
      corporate_culture: this.fb.group({
        introduction: [false],
        growth: [false],
        maturity: [false],
        licensed: [false],
      }),
      corporate_culture_text: [''],
      business_conduct: this.fb.group({
        introduction: [false],
        growth: [false],
        maturity: [false],
        licensed: [false],
      }),
      business_conduct_text: [''],
    });
  }

ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    const companyId = params['companyId'];
    const year = params['year'];
    if (companyId && year) {
      this.governanceService.getGovernanceMetricsByCompanyId(companyId).subscribe(metrics => {
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
        this.governanceMetricsForm.patchValue({ company_id: companyId, year: year });
      });
    }
  });
}

  loadMetricData(metricId: number): void {
    this.governanceService.getGovernanceMetric(metricId).subscribe((metric) => {
      this.governanceMetricsForm.patchValue(metric);
    });
  }

  onSubmit(nextRoute?: string): void {
    if (this.governanceMetricsForm.valid) {
      const formData = this.governanceMetricsForm.value;
      if (this.metricId) {
        this.governanceService
          .updateGovernanceMetric(this.metricId, formData)
          .subscribe({
            next: (response) => {
              this.snackBar.open(
                'Governance Metrics updated successfully',
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
              console.error('Error updating Governance Metrics', error);
              this.snackBar.open(
                'Failed to update Governance Metrics ',
                'Close',
                {
                  duration: 3000,
                }
              );
            },
          });
      } else {
        this.governanceService.createGovernanceMetric(formData).subscribe({
          next: (response) => {
            console.log('Governance Metrics created successfully', response);
            this.snackBar.open(
              'Governance Metrics created successfully',
              'Close',
              {
                duration: 3000,
              }
            );
            this.governanceMetricsForm.reset();
            this.router.navigate([`/dashboard`], {});
          },
          error: (error) => {
            console.error('Error creating Governance Metrics', error);
            this.snackBar.open('Failed to create Governance Metrics', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    }
  }

  onEnvironmentalMetrics(): void {
    this.onSubmit('/extra/enviromental_metrics');
  }

  onSocialMetrics(): void {
    this.onSubmit('/extra/social_metrics');
  }
}
