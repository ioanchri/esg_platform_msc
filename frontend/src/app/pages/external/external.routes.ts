import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { EsgPortfolioComponent } from './esg-portfolio/esg-portfolio.component';
export const ExternalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'esg-portfolio/:year',
        component: EsgPortfolioComponent,
      },
    ],
  },
];
