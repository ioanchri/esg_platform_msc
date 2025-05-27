import { Routes } from '@angular/router';
import { AppCompaniesTableComponent } from './companies-table/companies-table.component';
import { AddCompanyComponent } from './addCompany/addCompany.component';
import { AddEnviromentalMetricsComponent } from './addEnvironmentalMetrics/add-enviromental-metrics.component';
import { AddSocialMetricsComponent } from './addSocialMetrics/add-social-metrics.component';
import { AddGovernanceMetricsComponent } from './addGovernanceMetrics/add-governance-metrics.component';
import { SelectYearComponent } from './select-year/select-year.component';
import { CompanyMetricsComponent } from './company-metrics/company-metrics.component';
import { AppAccountSettingsComponent } from './account-settings/account-settings.component';
import { AuthGuard } from '../../guards/auth.guard';
import { AppFaqComponent } from './faq/faq.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MyMetricsComponent } from './my-metrics/my-metrics.component';
import { MyCompanyComponent } from './my-company/my-company.component';
import { AdminGuard } from '../../guards/admin.guard';
import { GoalsComponent } from '../../components/goals/goals.component';
import { ReportsComponent } from './reports/reports.component';
import { UserManagerComponent } from '../../components/user-manager/user-manager.component';

export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'companies-table',
        component: AppCompaniesTableComponent,
        canActivate: [AdminGuard],

      },
      {
        path: 'user-manager',
        component: UserManagerComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'addCompany',
        component: AddCompanyComponent,
        canActivate: [AuthGuard],
        
      },
      {
        path: 'select-year',
        component: SelectYearComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'enviromental_metrics',
        component: AddEnviromentalMetricsComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'social_metrics',
        component: AddSocialMetricsComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'governance_metrics',
        component: AddGovernanceMetricsComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'companies/:id/metrics',
        component: CompanyMetricsComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'account-settings',
        component: AppAccountSettingsComponent,
        canActivate: [AuthGuard],

      },
      {
        path: 'faq',
        component: AppFaqComponent
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'my-metrics',
        component: MyMetricsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'my-company',
        component: MyCompanyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'my-goals',
        component: GoalsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard],
      }
    ],
  },
];
