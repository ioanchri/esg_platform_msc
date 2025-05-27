import { CommonModule } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { MaterialModule } from "../../../material.module";

import { CompanyMetricsComponent } from "../company-metrics/company-metrics.component";
import { User, UserService } from "../../../services/user.service";
import { AuthService } from "../../../services/auth.service";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'my-metrics',
  standalone: true,
  imports: [MaterialModule,CommonModule,CompanyMetricsComponent,RouterModule],
  templateUrl: './my-metrics.component.html',
})
export class MyMetricsComponent{
  @Input() companyId: number | null = null;
  @Input() showButtons: boolean = true;
  user: User | null = null;
  router: any;
  username: string | null = null;

  
constructor(
  private authService: AuthService,
  private userService: UserService,
) {}

ngOnInit(): void {
  this.username = this.authService.getUsername();
  if (this.username) {
    this.userService.getUserByUsername(this.username).subscribe((user: User) => {
      this.user = user;
    }
    );
  }
  this.onMetricsTabClick();
}

  onMetricsTabClick(): void {
    if (this.user?.company_id) {
      this.router.navigate(['/extra/company-metrics'], { queryParams: { companyId: this.user.company_id } });
    }
  }

}
  
