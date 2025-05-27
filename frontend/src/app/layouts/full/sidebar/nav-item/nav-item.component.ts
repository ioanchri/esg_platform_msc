import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import { Router } from '@angular/router';
// import { NavService } from '../../../../services/nav.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material.module';
import { NavService } from '../../../../services/nav.service';
import { NavItem } from './nav-item';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [TranslateModule, MaterialModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  //@HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(public navService: NavService, public router: Router,public authService: AuthService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {});
  }

  onItemSelected(item: NavItem) {
    this.router.navigate([item.route]);

    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  onSubItemSelected(item: NavItem) {
    
  }
}
