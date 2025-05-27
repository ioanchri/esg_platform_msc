import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { MaterialModule } from '../../material.module';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './user-manager.component.html',
})
export class UserManagerComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'role', 'actions'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  deleteUser(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this user?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(userId).subscribe(() => {
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadUsers();
        });
      }
    });
  }

  resetPassword(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to reset the password for this user?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.resetPassword(userId).subscribe(() => {
          this.snackBar.open('Password reset successfully to 123456', 'Close', {
            duration: 3000,
          });
        });
      }
    });
  }
}