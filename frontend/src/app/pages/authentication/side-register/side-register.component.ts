import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../../shared/success-dialog/success-dialog.component';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  role: string = 'user';
  company_id: number = 1;
  errorMessage: string = '';
  form: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(
      {
        uname: ['', [Validators.required, Validators.minLength(5)],[this.usernameExistsValidator()]],
        email: ['', [Validators.required, Validators.email],[this.emailExistsValidator()]],
        password: ['', [Validators.required]],
        repeatPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsMismatch: true };
  }

  get f() {
    return this.form.controls;
  }

  usernameExistsValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.userService
        .checkUsername(control.value)
        .pipe(map((exists) => (exists ? { usernameExists: true } : null)));
    };
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      return this.userService
        .checkEmail(control.value)
        .pipe(map((exists) => (exists ? { emailExists: true } : null)));
    };
  }

  register() {
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(
        () => {
          this.authService.login(this.username, this.password).subscribe(
            () => {
              const dialogRef = this.dialog.open(SuccessDialogComponent, {
                data: { message: 'You have successfully registered and logged in!' },
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
        },
        (error) => {
          console.error('Registration failed', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      );
  }
}
