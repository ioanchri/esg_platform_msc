import { NavItem } from './nav-item/nav-item';
import { AuthService } from '../../../services/auth.service';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Home',
    iconName: 'ic:baseline-home',
    route: '/dashboard',
  },
  {
    displayName: 'Login',
    iconName: 'solar:login-3-line-duotone',
    route: '/authentication/login',
    condition: (authService: AuthService) => !authService.isLoggedIn(),
  },
  {
    displayName: 'Register',
    iconName: 'solar:user-plus-rounded-line-duotone',
    route: '/authentication/register',
    condition: (authService: AuthService) => !authService.isLoggedIn(),
  },
  {
    navCap: 'Apps',
    divider: true,
  },
  {
    displayName: 'My Company',
    iconName: 'solar:buildings-2-bold',
    route: '/extra/my-company',
  },
  {
    displayName: 'My Metrics',
    iconName: 'solar:sim-cards-line-duotone',
    route: '/extra/my-metrics',
  },
  {
    displayName: 'Graphs & Statistics',
    iconName: 'nimbus:stats',
    route: '/extra/statistics',
  },
  {
    displayName: 'Goals',
    iconName: 'solar:target-bold',
    route: '/extra/my-goals',
  },
  {
    displayName: 'Reports',
    iconName: 'material-symbols:newspaper',
    route: '/extra/reports',
  },
  {
    displayName: 'FAQ',
    iconName: 'solar:question-circle-linear',
    route: '/extra/faq',
  },
  {
    displayName: 'Settings',
    iconName: 'solar:settings-linear',
    route: '/extra/account-settings',
  },
  {
    navCap: 'Admin Tools',
    divider: true,
    condition: (authService: AuthService) => authService.isAdmin(),
  },
  {
    displayName: 'Companies',
    iconName: 'solar:planet-3-line-duotone',
    route: '/extra/companies-table',
    condition: (authService: AuthService) => authService.isAdmin(),
  },
  {
    displayName: 'User Manager',
    iconName: 'grommet-icons:user-admin',
    route: '/extra/user-manager',
    condition: (authService: AuthService) => authService.isAdmin(),
  },

];
