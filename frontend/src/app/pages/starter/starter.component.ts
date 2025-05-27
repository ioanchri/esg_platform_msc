import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppDailyActivitiesComponent } from '../../components/daily-activities/daily-activities.component';
import { IndustryPieChartComponent } from '../../components/industry-pie-chart/industry-pie-chart.component';
import { DashboardCardsComponent } from '../../components/dashboard-cards/dashboard-cards.component';
import { AuthService } from '../../services/auth.service';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { AppGovernanceMetricsGoalsComponent } from '../../components/governance-metrics-goals/governance-metrics-goals.component';
import { StatisticsComponent } from '../../pages/extra/statistics/statistics.component';
import { AppGuideComponent } from '../../components/app-guide/app-guide.component';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    IndustryPieChartComponent,
    DashboardCardsComponent,
    ProfileCardComponent,
    AppGuideComponent
],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent {

  username: string | null = null;

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }
}
