import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';

interface stats {
  id: number;
  time: string;
  color: string;
  title?: string;
  subtext?: string;
  link?: string;
}

@Component({
  selector: 'app-daily-activities',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './daily-activities.component.html',
})
export class AppDailyActivitiesComponent {
  stats: stats[] = [
    {
      id: 1,
      time: '09.00 am',
      color: 'primary',
      title: 'Company Added',
      subtext: 'Tech Innovators was added to the system.',
    },
    {
      id: 2,
      time: '09.30 am',
      color: 'accent',
      title: 'Environmental Metrics Added',
      subtext: 'Environmental metrics for Tech Innovators were added for the year 2023.',
    },
    {
      id: 3,
      time: '11.00 am',
      color: 'error',
      title: 'Company Added',
      subtext: 'Athens Automotive was added to the system.',
    },
    {
      id: 4,
      time: '11.30 am',
      color: 'accent',
      title: 'Environmental Metrics Added',
      subtext: 'Environmental metrics for Athens Automotive were added for the year 2023.',
    },
    {
      id: 5,
      time: '12.00 pm',
      color: 'warning',
      title: 'Social Metrics Added',
      subtext: 'Social metrics for Athens Automotive were added for the year 2023.',
    },
    {
      id: 6,
      time: '12.30 pm',
      color: 'primary',
      title: 'Governance Metrics Added',
      subtext: 'Governance metrics for Athens Automotive were added for the year 2023.',
    },
  ];
}
