import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {

  username: string | null = null;

  constructor(private authService: AuthService ) { }
  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }
}
