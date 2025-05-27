import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../services/auth.service';
import { GovernanceService } from '../../services/governance_metrics.service';
import { User } from '../../services/user.service';

@Component({
  selector: 'app-governance-metrics-goals',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './governance-metrics-goals.component.html',
})
export class AppGovernanceMetricsGoalsComponent {
  metrics: { year: number; percentage: number }[] = [];
  constructor(
    private authService: AuthService,
    private governanceService: GovernanceService
  ) {}

  ngOnInit() {
    const username = this.authService.getUsername();

    if (username) {
      this.authService.getUserByUsername(username).subscribe((user: User) => {
        if (user.company_id) {
          this.loadGovernanceMetricsGoals(user.company_id);
        }
      });
    }
  }

  loadGovernanceMetricsGoals(company_id: number): void {
    this.governanceService
      .getGovernanceMetricsGoals(company_id)
      .subscribe((data) => {
        this.metrics = data.map((item: any) => ({
          year: item.year,
          percentage: item.percentage,
        }));
      });
  }
}