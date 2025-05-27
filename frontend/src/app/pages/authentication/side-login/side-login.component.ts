
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { SuccessDialogComponent } from '../../../shared/success-dialog/success-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router,private authService: AuthService,private dialog: MatDialog) {}
  errorMessage: string = '';

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const username = this.form.value.username ?? '';
      const password = this.form.value.password ?? '';
      this.authService.login(username, password).subscribe(
        () => {
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: { message: 'You have successfully logged in!' },
          });
  
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Login failed. Please try again.';
        }
      );
    }
  }
}
