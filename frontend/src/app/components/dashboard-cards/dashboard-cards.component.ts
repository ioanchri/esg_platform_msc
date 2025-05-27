import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface topcards {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule, RouterModule],
  templateUrl: './dashboard-cards.component.html',
})
export class DashboardCardsComponent implements OnInit {
  totalCompanies: number = 0;
  topcards: topcards[] = [];
  companyId: number | null = null;

  constructor(private companyService: CompanyService,private authService: AuthService) {}

  ngOnInit(): void {
    this.companyService.getCompaniesCount().subscribe({
      next: (count) => {
        this.totalCompanies = count;
        this.updateTopCards();
      },
      error: (error) => {
        console.error('Error fetching companies count', error);
      },
    });

    const username = this.authService.getUsername();
    if (username) {
      this.authService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.companyId = user.company_id;
          this.updateTopCards();
        },
        error: (error) => {
          console.error('Error fetching user details', error);
        },
      });
    }
  }

  updateTopCards(): void {
    this.topcards = [
      {
        id: 1,
        color: 'warning',
        icon: 'hugeicons:building-05',
        title: 'Total Companies',
        subtitle: this.totalCompanies.toString(),
        route: '/extra/my-company',
      },
      {
        id: 2,
        color: 'success',
        icon: 'tdesign:undertake-environment-protection-filled',
        title: 'Company Metrics',
        subtitle: 'View your metrics',
        route: `/extra/my-metrics`,
      },
      {
        id: 3,
        color: 'warning',
        icon: 'iconoir:graph-up',
        title: 'Statistics',
        subtitle: 'Personalized graphs',
        route: '/extra/statistics'

      },
      {
        id: 4,
        color: 'error',
        icon: 'streamline:target-solid',
        title: 'Goals',
        subtitle: 'Set your goals',
        route: '/extra/my-goals'
      },
      // {
      //   id: 5,
      //   color: 'success',
      //   icon: 'ic:outline-forest',
      //   title: 'Total Income',
      //   subtitle: '$36,715',
      // },
    ];
  }
}
