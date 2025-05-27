import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';

interface notifications {
  id: number;
  icon: string;
  color: string;
  title: string;
  time: string;
  subtitle: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  userEmail: string | null = null;
  username: string | null = null;
  role: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/authentication/login']);
  }
  login(): void {
    this.router.navigate(['/authentication/login']);
  }
  register(): void {
    this.router.navigate(['/authentication/register']);
  }

  ngOnInit(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.authService.getUserByUsername(username).subscribe((user) => {
        this.userEmail = user.email;
        this.username = user.username;
        this.role = user.role;
      });
    }
  }

  notifications: notifications[] = [
    {
      id: 1,
      icon: 'a-b-2',
      color: 'primary',
      time: '8:30 AM',
      title: 'Notification',
      subtitle: 'You have no new notifications!',
    },
    {
      id: 2,
      icon: 'calendar',
      color: 'accent',
      time: '8:21 AM',
      title: 'Reminder',
      subtitle: 'Submit your metrics for the current year.'
    }
  ];
}
