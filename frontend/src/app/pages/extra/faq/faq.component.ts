import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MaterialModule } from '../../../material.module';
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './faq.component.html',
})
export class AppFaqComponent {
  constructor() {}

  panelOpenState = false;
}
