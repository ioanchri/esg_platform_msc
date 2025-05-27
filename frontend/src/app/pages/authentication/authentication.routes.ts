import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { AppSideForgotPasswordComponent } from './side-forgot-password/side-forgot-password.component';
import { IndustryPieChartComponent } from '../../components/industry-pie-chart/industry-pie-chart.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'forgot-password',
        component: AppSideForgotPasswordComponent,
      },
      {
        path: 'protected',
        component: IndustryPieChartComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
