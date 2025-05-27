import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService, User } from '../../../services/user.service';
import { CompanyService, Company } from '../../../services/company.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-company',
  standalone: true,
  imports: [CommonModule, MaterialModule,RouterModule],
  templateUrl: './my-company.component.html',
})
export class MyCompanyComponent implements OnInit {
  user: User | null = null;
  company: Company | null = null;
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.username) {
      this.userService.getUserByUsername(this.username).subscribe((user: User) => {
        this.user = user;
        if (this.user.company_id) {
          this.loadCompanyDetails(this.user.company_id);
        }
      });
    }
  }

  loadCompanyDetails(companyId: number): void {
    this.companyService.getCompanyById(companyId).subscribe((company: Company) => {
      this.company = company;
    });
  }

  editCompany(): void {
    if (this.company) {
      this.router.navigate(['/extra/addCompany'], { queryParams: { companyId: this.company.id } });
    }
  }

  confirmDeleteCompany(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete the company ${this.company?.name}?` },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && this.company) {
        this.deleteCompany(this.company.id);
      }
    });
  }

  deleteCompany(companyId: number): void {
    this.companyService.deleteCompany(companyId).subscribe({
      next: () => {
        this.snackBar.open('Company deleted successfully', 'Close', { duration: 3000 });
        this.company = null;
        
      },
      error: (error) => {
        console.error('Error deleting company', error);
        this.snackBar.open('Failed to delete company', 'Close', { duration: 3000 });
      },
    });
  }
}