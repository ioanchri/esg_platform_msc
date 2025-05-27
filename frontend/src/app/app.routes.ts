import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
        canActivate: [AuthGuard],
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.AppsRoutes),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: 'external',
        loadChildren: () =>
          import('./pages/external/external.routes').then(
            (m) => m.ExternalRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
