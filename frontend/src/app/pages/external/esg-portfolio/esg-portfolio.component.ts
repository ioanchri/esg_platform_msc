import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { EnvironmentalService } from '../../../services/enviromental_metrics.service';
import { SocialService } from '../../../services/social_metrics.service';
import { GovernanceService } from '../../../services/governance_metrics.service';
import { AuthService } from '../../../services/auth.service';
import { UserService, User } from '../../../services/user.service';
import { Company } from '../../../services/company.service';
import { StatisticsComponent } from '../../extra/statistics/statistics.component';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppGovernanceMetricsGoalsComponent } from "../../../components/governance-metrics-goals/governance-metrics-goals.component";

interface YearlyMetrics {
  year: number;
  environmental: any;
  social: any;
  governance: any;
}

interface Metrics {
  year: number;
  environmental: any;
  social: any;
  governance: any;
}

@Component({
  selector: 'app-esg-portfolio',
  standalone: true,
  imports: [CommonModule, MaterialModule, StatisticsComponent, AppGovernanceMetricsGoalsComponent],
  templateUrl: './esg-portfolio.component.html',
  styleUrls: ['./esg-portfolio.component.scss'],
})
export class EsgPortfolioComponent implements OnInit {
  companyId: number | null = null;
  company: Company | null = null;
  metrics: Metrics | null = null;
  username: string | null = null;
  user: User | null = null;
  selectedYear: number | null = null;
  years: number[] = [];
  yearlyMetrics: YearlyMetrics[] = [];
  esgScore: any = null;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private environmentalService: EnvironmentalService,
    private socialService: SocialService,
    private governanceService: GovernanceService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCompanyId().subscribe((companyId) => {
      this.companyId = companyId;
      if (this.companyId) {
        this.loadCompanyDetails();
        this.route.paramMap.subscribe((params) => {
          const yearParam = params.get('year');
          this.selectedYear = yearParam ? +yearParam : null;
          this.loadMetrics(this.companyId!);
        });
      }
    });
  }

  loadCompanyDetails(): void {
    if (this.companyId !== null) {
      this.companyService
        .getCompanyById(this.companyId)
        .subscribe((company) => {
          this.company = company;
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

  loadMetrics(companyId: number): void {
    if (this.selectedYear !== null) {
      this.environmentalService
        .getEnvironmentalMetricsByCompanyId(companyId)
        .subscribe((envMetrics) => {
          this.socialService
            .getSocialMetricsByCompanyId(companyId)
            .subscribe((socialMetrics) => {
              this.governanceService
                .getGovernanceMetricsByCompanyId(companyId)
                .subscribe((govMetrics) => {
                  this.metrics = {
                    year: this.selectedYear!,
                    environmental: envMetrics.find(
                      (metric) => metric.year === this.selectedYear
                    ),
                    social: socialMetrics.find(
                      (metric) => metric.year === this.selectedYear
                    ),
                    governance: govMetrics.find(
                      (metric) => metric.year === this.selectedYear
                    ),
                  };
                  // Fetch ESG score for this year
                  this.companyService.getEsgScore(companyId, this.selectedYear!).subscribe(score => {
                    this.esgScore = score;
                  });
                });
            });
        });
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
