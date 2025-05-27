import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../material.module';
import { BrandingComponent } from './branding.component';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, TablerIconsModule, MaterialModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor() { }
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  ngOnInit(): void { }
}