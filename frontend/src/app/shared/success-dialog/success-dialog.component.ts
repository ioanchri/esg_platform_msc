import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  standalone: true,
  imports: [MaterialModule],
  styleUrls: ['./success-dialog.component.scss'],
})
export class SuccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }

  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }
}