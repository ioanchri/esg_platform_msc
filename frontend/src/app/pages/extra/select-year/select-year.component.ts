import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService } from '../../../services/company.service';
import { EnvironmentalService } from '../../../services/enviromental_metrics.service';
import { GovernanceService } from '../../../services/governance_metrics.service';
import { SocialService } from '../../../services/social_metrics.service';
@Component({
  selector: 'app-select-year',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './select-year.component.html',
})
export class SelectYearComponent {
  yearForm: FormGroup;
  companyId!: number;
  metrics: { year: number }[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private environmentalService: EnvironmentalService,
    private socialService: SocialService,
    private governanceService: GovernanceService,
    private snackBar: MatSnackBar
  ) {
    this.yearForm = this.fb.group({
      year: ['', Validators.required],
    });

  }

  years: { value: number; viewValue: number }[] = [
    { value: 2019, viewValue: 2019 },
    { value: 2020, viewValue: 2020 },
    { value: 2021, viewValue: 2021 },
    { value: 2022, viewValue: 2022 },
    { value: 2023, viewValue: 2023 },
    { value: 2024, viewValue: 2024 },
    { value: 2025, viewValue: 2025 },

  ];
  selectedYear = this.years[0].value;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.companyId = params['companyId'];
      if (this.companyId) {
        this.loadMetrics();
      }
    });
  }

  loadMetrics(): void {
    this.environmentalService
      .getEnvironmentalMetricsByCompanyId(this.companyId)
      .subscribe((envMetrics) => {
        this.socialService
          .getSocialMetricsByCompanyId(this.companyId)
          .subscribe((socialMetrics) => {
            this.governanceService
              .getGovernanceMetricsByCompanyId(this.companyId)
              .subscribe((govMetrics) => {
                const years = new Set<number>();
                envMetrics.forEach((metric) => years.add(metric.year));
                socialMetrics.forEach((metric) => years.add(metric.year));
                govMetrics.forEach((metric) => years.add(metric.year));

                this.metrics = Array.from(years).map((year) => ({ year }));
              });
          });
      });
  }

  onSubmit(): void {
    if (this.yearForm.valid) {
      const year = this.yearForm.value.year;
      const existingMetric = this.metrics.find(
        (metric) => metric.year === year
      );

      if (existingMetric) {
        this.snackBar.open(
          `Metrics for ${year} already exist for this company.`,
          'Close',
          { duration: 3000 }
        );
      } else {
        this.router.navigate(['/extra/enviromental_metrics'], {
          queryParams: { companyId: this.companyId, year: year},
        });
      }
    }
  }
}
