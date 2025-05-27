import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company, CompanyService } from '../../../services/company.service';
import { EnvironmentalService } from '../../../services/enviromental_metrics.service';
import { SocialService } from '../../../services/social_metrics.service';
import { GovernanceService } from '../../../services/governance_metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface YearlyMetrics {
  year: number;
  environmental: any;
  social: any;
  governance: any;
}

@Component({
  selector: 'app-company-metrics',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './company-metrics.component.html',
})
export class CompanyMetricsComponent implements OnInit {
  @Input() companyId: number | null = null;
  @Input() showButtons: boolean = true;
  nameCompany: string = '';
  yearlyMetrics: YearlyMetrics[] = [];
  years: string = '';
  public loading: boolean = true;
  esgScores: { [year: number]: any } = {};

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private environmentalService: EnvironmentalService,
    private socialService: SocialService,
    private governanceService: GovernanceService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.companyId != null) {
      this.loadCompanyDetails();
      this.loadMetrics();
    }
  }

  loadCompanyDetails(): void {
    this.companyService
      .getCompanyById(this.companyId!)
      .subscribe((company: Company) => {
        this.nameCompany = company.name;
      });
  }

  loadMetrics(): void {
    if (this.companyId == null) return;
    const companyIdNum = this.companyId as number;
    this.environmentalService
      .getEnvironmentalMetricsByCompanyId(companyIdNum)
      .subscribe((envMetrics) => {
        this.socialService
          .getSocialMetricsByCompanyId(companyIdNum)
          .subscribe((socialMetrics) => {
            this.governanceService
              .getGovernanceMetricsByCompanyId(companyIdNum)
              .subscribe((govMetrics) => {
                const years = new Set<number>();
                envMetrics.forEach((metric) => years.add(metric.year));
                socialMetrics.forEach((metric) => years.add(metric.year));
                govMetrics.forEach((metric) => years.add(metric.year));

                this.yearlyMetrics = Array.from(years).map((year) => ({
                  year,
                  environmental: envMetrics.find((metric) => metric.year === year),
                  social: socialMetrics.find((metric) => metric.year === year),
                  governance: govMetrics.find((metric) => metric.year === year),
                }));
                this.yearlyMetrics.sort((a, b) => a.year - b.year);
                this.years = Array.from(years).join(', ');
                this.loading = false;
                // Fetch ESG scores for all years
                this.yearlyMetrics.forEach((m) => {
                  this.companyService.getEsgScore(companyIdNum, m.year).subscribe(score => {
                    this.esgScores[m.year] = score;
                  });
                });
              });
          });
      });
  }

  loadMetricsForYear(year: number): void {
    if (this.companyId == null) return;
    const companyIdNum = this.companyId as number;
    this.companyService.getEsgScore(companyIdNum, year).subscribe(score => {
      this.esgScores[year] = score;
    });
  }

  confirmDeleteMetrics(year: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete the metrics for the year ${year}?`,
      },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteMetrics(year);
      }
    });
  }

  deleteMetrics(year: number): void {
    const envMetric = this.yearlyMetrics.find(
      (m) => m.year === year
    )?.environmental;
    const socialMetric = this.yearlyMetrics.find(
      (m) => m.year === year
    )?.social;
    const govMetric = this.yearlyMetrics.find(
      (m) => m.year === year
    )?.governance;

    if (envMetric) {
      this.environmentalService
        .deleteEnvironmentalMetric(envMetric.id)
        .subscribe(() => {
          this.snackBar.open(
            `Environmental metrics for ${year} deleted`,
            'Close',
            { duration: 3000 }
          );
        });
    }

    if (socialMetric) {
      this.socialService.deleteSocialMetric(socialMetric.id).subscribe(() => {
        this.snackBar.open(`Social metrics for ${year} deleted`, 'Close', {
          duration: 3000,
        });
      });
    }

    if (govMetric) {
      this.governanceService
        .deleteGovernanceMetric(govMetric.id)
        .subscribe(() => {
          this.snackBar.open(
            `Governance metrics for ${year} deleted`,
            'Close',
            { duration: 3000 }
          );
        });
    }

    this.yearlyMetrics = this.yearlyMetrics.filter((m) => m.year !== year);
  }

  redirectToSelectYear(): void {
    this.router.navigate(['/extra/select-year'], {
      queryParams: { companyId: this.companyId },
    });
  }

  editEnvironmentalMetrics(metric: any): void {
    this.router.navigate(['/extra/enviromental_metrics'], {
      queryParams: {
        companyId: this.companyId,
        year: metric.year,
        // metricId: metric.id,
        // turnover: metric.turnover,
      },
    });
  }

  editSocialMetrics(metric: any): void {
    this.router.navigate(['/extra/social_metrics'], {
      queryParams: {
        companyId: this.companyId,
        year: metric.year,
        // metricId: metric.id,
      },
    });
  }

  editGovernanceMetrics(metric: any): void {
    this.router.navigate(['/extra/governance_metrics'], {
      queryParams: {
        companyId: this.companyId,
        year: metric.year,
      },
    });
  }
}
