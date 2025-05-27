import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Company, CompanyService } from '../../../services/company.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router,ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Country, City, Industry, Year,Building, countries, cities, industries, years, buildings } from '../../../models/interfaces';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-addCompany',
  templateUrl: './addCompany.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AddCompanyComponent {
  companyForm: FormGroup;
  companyId: number | null = null;
  errorMessage: string = '';
  startYear = new Date();
  country: Country[] = countries;
  cities: City[] = cities;
  industries: Industry[] = industries;
  years: Year[] = years;
  buildings: Building[] = buildings;
  filteredCountries!: Observable<Country[]>;
  filteredYear!: Observable<Year[]>;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService  

  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      industry: [''],
      contact_email: ['', [Validators.required, Validators.email]],
      website: [''],
      phone_number: [''],
      year_founded: [''],
      country: [''],
      city: [''],
      address: [''],
      postal_code: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.companyId = params['companyId'] ? +params['companyId'] : null;
      if (this.companyId) {
        this.companyService.getCompany(this.companyId).subscribe((company) => {
          this.companyForm.patchValue(company);
        });
      }
    });

    if (!this.companyId) {
    const username = this.authService.getUsername();
    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (company) => {
          if (company.company_id !== null) {
            this.snackBar.open('You already have a company. You cannot add another one.', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/extra/my-company']);
          }
        },
        error: (error) => {
          console.error('Error checking company', error);
        },
      });
    }
  }

  this.filteredCountries = this.companyForm.get('country')!.valueChanges.pipe(
    startWith(''),
    map(value => this._filterCountries(value))
  );

  this.filteredYear = this.companyForm.get('year_founded')!.valueChanges.pipe(
    startWith(''),
    map(value => this._filterYears(value))
  );
  }

  private _filterYears(value: string): Year[] {
    return this.years.filter(option => option.viewValue.includes(value));
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.country.filter(option => option.viewValue.toLowerCase().includes(filterValue));
  }


  onSubmit(): void {
    if (this.companyForm.valid) {
      const company: Company = this.companyForm.value;
      if (this.companyId) {
        this.companyService.updateCompany(this.companyId, company).subscribe({
          next: (response) => {
            this.snackBar.open('Company updated successfully', 'Close', {
              duration: 3000,
            });
            console.log('Company updated successfully', response);
            this.router.navigate(['/extra/companies-table']);
          },
          error: (error) => {
            this.snackBar.open('Failed to update company', 'Close', {
              duration: 3000,
            });
          },
        });
      } else {
        this.companyService.createCompany(company).subscribe({
          next: (response) => {
            this.snackBar.open('Company created successfully', 'Close', {
              duration: 3000,
            });
          this.router.navigate(['/extra/select-year'], {
            queryParams: { companyId: response.id },
          });
          },
          error: (error) => {
            this.errorMessage = 'Fill in all the required fields';
            this.snackBar.open('Failed to create company', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    }
  }


  selectedCountry = this.country[0].value;
  selectedCity = this.cities[0].value;
  selectedIndustry = this.industries[0].value;
  selectedYear = this.years[0].value;
  selectedBuilding = this.buildings[0].value;
}
