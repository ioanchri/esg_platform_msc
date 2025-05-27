import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyService, Company } from '../../../services/company.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { RouterLink, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CompanyPdfService } from '../../../services/company-pdf.service';
import saveAs from 'file-saver';

@Component({
  selector: 'app-companies-table',
  standalone: true,
  imports: [MaterialModule,CommonModule, RouterLink],
  templateUrl: './companies-table.component.html',
})
export class AppCompaniesTableComponent implements OnInit {
  @Input() company: Company | null = null;
  @Input() companyId: number | null = null;

  displayedColumns: string[] = [
    'id',
    'name',
    'industry',
    'contact_email',
    'website',
    'phone_number',
    'number_of_buildings',
    'year_founded',
    'country',
    'city',
    'address',
    'postal_code',
    'metrics',
    'edit',
    'delete',];
  dataSource = new MatTableDataSource<Company>();

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

  constructor(
    private companyService: CompanyService,
    private companypdfService: CompanyPdfService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe((data) => {
      // this.dataSource.data = data;
      if (this.companyId) {
        this.dataSource.data = data.filter(company => company.id === this.companyId);
      } else {
        this.dataSource.data = data;
      }
    });
  }

  fetchMetrics(companyId: number): void {
    this.companyService.getCompanyMetrics(companyId).subscribe((metrics) => {
      const company = this.dataSource.data.find((c) => c.id === companyId);
      if (company) {
        company.metrics = metrics;
      }
    });
  }

  confirmDelete(companyId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete the company?` },

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCompany(companyId);
      }
    });
  }

  deleteCompany(companyId: number): void {
    this.companyService.deleteCompany(companyId).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (company) => company.id !== companyId
        );
        this.snackBar.open('Company deleted successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error deleting company', error);
        this.snackBar.open('Failed to delete company', 'Close', {
          duration: 3000,
        });
      },
    });
  }
  editCompany(companyId: number): void {
    this.router.navigate(['/extra/addCompany'], { queryParams: { companyId } });
  }

  editMetrics(companyId: number): void {
    this.router.navigate(['/extra/companies', companyId, 'metrics']);
  }
  downloadCompanyPdf(companyId: number): void {
    this.companypdfService.downloadCompanyPdfTest(companyId).subscribe((blob) => {
      saveAs(blob, `company_${companyId}.pdf`);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  
}
