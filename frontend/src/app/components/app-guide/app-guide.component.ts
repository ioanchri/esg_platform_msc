import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CompanyService } from '../../services/company.service';
import { GoalService } from '../../services/goal.service';
import { EnvironmentalService } from '../../services/enviromental_metrics.service';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [MaterialModule,RouterModule,CommonModule],
  templateUrl: './app-guide.component.html',
})
export class AppGuideComponent implements OnInit {

  steps = [
    { title: 'Company', route: '/extra/my-company', completed: false, disabled: false },
    { title: 'Metrics', route: '/extra/my-metrics', completed: false, disabled: true },
    { title: 'Goals', route: '/extra/my-goals', completed: false, disabled: true },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private companyService: CompanyService,
    private environmentalService: EnvironmentalService,
    private goalsService: GoalService
  ) {}

  ngOnInit(): void {
    this.checkCompletionStatus();
  }

  checkCompletionStatus(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.authService.getUserByUsername(username).subscribe((user) => {
        if (user.company_id) {
          this.steps[0].completed = true;
          this.steps[1].disabled = false;

          this.environmentalService.getEnvironmentalMetricsByCompanyId(user.company_id).subscribe((metrics) => {
            if (metrics.length > 0) {
              this.steps[1].completed = true;
              this.steps[2].disabled = false;

            }
          });
          this.goalsService.getGoalsByCompany(user.company_id).subscribe((goals) => {
            if (goals.length > 0) {
              this.steps[2].completed = true;
            }
          });
        }
      });
    }
  }

  navigateTo(route: string, disabled: boolean): void {
    if (!disabled) {
      this.router.navigate([route]);
    }
  }
}