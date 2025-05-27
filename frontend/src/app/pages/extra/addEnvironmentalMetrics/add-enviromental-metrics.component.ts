import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { EnvironmentalService } from '../../../services/enviromental_metrics.service';
import { MaterialModule } from '../../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';

interface Object {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-enviromental-metrics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './add-enviromental-metrics.component.html',
})
export class AddEnviromentalMetricsComponent implements OnInit {
  @Output() fileUploaded = new EventEmitter<string>();

  uploadForm: FormGroup;
  selectedElectricityFile: File | null = null;
  selectedGasFile: File | null = null;
  selectedCarDieselFile: File | null = null;
  selectedCarFuelFile: File | null = null;
  selectedCarElectricityFile: File | null = null;

  electricityPdfUrl: string | null = null;
  gasPdfUrl: string | null = null;
  carDieselPdfUrl: string | null = null;
  carFuelPdfUrl: string | null = null;
  carElectricityPdfUrl: string | null = null;
  uploadSuccess: { [key: string]: boolean } = {};

  companyId: number | null = null;
  metricId: number | null = null;
  envMetricsForm: FormGroup;
  public currentDate = new Date();
  isUpdateMode: boolean = false;
  generalDataFormGroup: FormGroup;
  energyFormGroup: FormGroup;
  transportationFormGroup: FormGroup;
  wasteFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private enviromentalMetricsService: EnvironmentalService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      file: [null],
    });

    this.envMetricsForm = this.fb.group({
      company_id: ['', Validators.required],
      year: ['', [Validators.required]],
      created_at: [this.currentDate],
    });

    this.generalDataFormGroup = this.fb.group({
      building_name: [null],
      square_meters: [null],
    });

    this.energyFormGroup = this.fb.group({
      electricity_consumption: [null],
      gas_consumption: [null],
    });

    this.transportationFormGroup = this.fb.group({
      car_diesel_consumption: [null],
      car_fuel_consumption: [null],
      car_electricity_consumption: [null],
    });

    this.wasteFormGroup = this.fb.group({
      hazardous_waste: [null],
      non_hazardous_waste: [null],
    });
  }

ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    const companyId = params['companyId'];
    const year = params['year'];
    if (companyId && year) {
      this.enviromentalMetricsService.getEnvironmentalMetricsByCompanyId(companyId).subscribe(metrics => {
        const metric = metrics.find((m: any) => m.year == year);
        if (metric) {
          this.isUpdateMode = true;
          this.metricId = metric.id ?? null;
          if (this.metricId !== null) {
            this.loadMetricData(this.metricId);
            this.loadPdf();
          }
        } else {
          this.isUpdateMode = false;
          this.metricId = null;
        }
        this.envMetricsForm.patchValue({ company_id: companyId, year: year });
      });
    }
  });
}

  loadMetricData(metricId: number): void {
    this.enviromentalMetricsService
      .getEnvironmentalMetricById(metricId)
      .subscribe((metric) => {
        this.envMetricsForm.patchValue(metric);
        this.generalDataFormGroup.patchValue(metric);
        this.energyFormGroup.patchValue(metric);
        this.transportationFormGroup.patchValue(metric);
        this.wasteFormGroup.patchValue(metric);
      });
  }

  building: Object[] = [
    { value: 'HeadQuarters', viewValue: 'HeadQuarters' },
    { value: 'Branch', viewValue: 'Branch' },
    { value: 'Warehouse', viewValue: 'Warehouse' },
    { value: 'Factory', viewValue: 'Factory' },
    { value: 'Lab', viewValue: 'Lab' },
    { value: 'Office', viewValue: 'Office' },
    { value: 'Other', viewValue: 'Other' },
  ];

  selectedIndustry = this.building[0].value;

  onSocialMetrics(): void {
    const companyId = this.envMetricsForm.get('company_id')?.value;
    const year = this.envMetricsForm.get('year')?.value;
    this.onSubmit('/extra/social_metrics');
  }
  onGovernanceMetrics(): void {
    const companyId = this.envMetricsForm.get('company_id')?.value;
    const year = this.envMetricsForm.get('year')?.value;
    this.onSubmit('/extra/governance_metrics');
  }

  onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (type === 'electricity') {
        this.selectedElectricityFile = file;
      } else if (type === 'gas') {
        this.selectedGasFile = file;
      } else if (type === 'carDiesel') {
        this.selectedCarDieselFile = file;
      } else if (type === 'carFuel') {
        this.selectedCarFuelFile = file;
      } else if (type === 'carElectricity') {
        this.selectedCarElectricityFile = file;
      }
    } else {
      if (type === 'electricity') {
        this.selectedElectricityFile = null;
      } else if (type === 'gas') {
        this.selectedGasFile = null;
      } else if (type === 'carDiesel') {
        this.selectedCarDieselFile = null;
      } else if (type === 'carFuel') {
        this.selectedCarFuelFile = null;
      } else if (type === 'carElectricity') {
        this.selectedCarElectricityFile = null;
      }
      alert('Please select a valid PDF file.');
    }
  }


  onUpload(type: string) {
    const file = (() => {
      switch (type) {
        case 'electricity':
          return this.selectedElectricityFile;
        case 'gas':
          return this.selectedGasFile;
        case 'carDiesel':
          return this.selectedCarDieselFile;
        case 'carFuel':
          return this.selectedCarFuelFile;
        case 'carElectricity':
          return this.selectedCarElectricityFile;
        default:
          return null;
      }
    })();
    if (file && this.metricId) {
      this.enviromentalMetricsService
        .uploadEnvironmentalMetricPdf(this.metricId, file, type)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully', response);
            this.fileUploaded.emit(response.filePath);
            this.loadPdf();
            this.onRemove(type);
            this.uploadSuccess[type] = true;
            setTimeout(() => (this.uploadSuccess[type] = false), 3000);
          },
          error: (error: any) => {
            console.error('Error uploading file', error);
          },
        });
    } else if (!this.metricId) {
      alert('Metric ID is not available. Please save the metric first.');
    }
  }

  onRemove(type: string) {
    if (type === 'electricity') {
      this.selectedElectricityFile = null;
    } else if (type === 'gas') {
      this.selectedGasFile = null;
    } else if (type === 'carDiesel') {
      this.selectedCarDieselFile = null;
    } else if (type === 'carFuel') {
      this.selectedCarFuelFile = null;
    } else if (type === 'carElectricity') {
      this.selectedCarElectricityFile = null;
    }
  }

  loadPdf(): void {
    if (this.metricId) {
      this.enviromentalMetricsService
        .downloadEnvironmentalMetricPdf(this.metricId, 'electricity')
        .subscribe({
          next: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            this.electricityPdfUrl = url;          },
          error: (error: any) => {
            this.electricityPdfUrl = null;
            console.error('Error loading electricity PDF', error);
          },
        });

      this.enviromentalMetricsService
        .downloadEnvironmentalMetricPdf(this.metricId, 'gas')
        .subscribe({
          next: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            this.gasPdfUrl = url;
          },
          error: (error: any) => {
            this.gasPdfUrl = null;
            console.error('Error loading gas PDF', error);
          },
        });

      this.enviromentalMetricsService
        .downloadEnvironmentalMetricPdf(this.metricId, 'carDiesel')
        .subscribe({
          next: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            this.carDieselPdfUrl = url;
          },
          error: (error: any) => {
            this.carDieselPdfUrl = null;
            console.error('Error loading carDiesel PDF', error);
          },
        });

      this.enviromentalMetricsService
        .downloadEnvironmentalMetricPdf(this.metricId, 'carFuel')
        .subscribe({
          next: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            this.carFuelPdfUrl = url;
          },
          error: (error: any) => {
            this.carFuelPdfUrl = null;
            console.error('Error loading carFuel PDF', error);
          },
        });

      this.enviromentalMetricsService
        .downloadEnvironmentalMetricPdf(this.metricId, 'carElectricity')
        .subscribe({
          next: (response: Blob) => {
            const url = window.URL.createObjectURL(response);
            this.carElectricityPdfUrl = url;
          },
          error: (error: any) => {
            this.carElectricityPdfUrl = null;
            console.error('Error loading carElectricity PDF', error);
          }
        });
    } else {
      console.log('No metricId available to load PDFs');
    }
  }

  onDelete(type: string) {
    const metricId = this.metricId;
    if (!metricId) {
      console.error('No metricId available for PDF delete');
      return;
    }
    this.enviromentalMetricsService
      .deleteEnvironmentalMetricPdf(metricId, type)
      .subscribe({
        next: () => {
          console.log('File deleted successfully');
          this.fileUploaded.emit();
          this.loadPdf();
        },
        error: (error: any) => {
          console.error('Error deleting file', error);
        },
      });
  }

  onViewPdf(type: string) {
    const metricId = this.metricId;
    if (!metricId) {
      console.error('No metricId available for PDF view');
      return;
    }
    this.enviromentalMetricsService
      .downloadEnvironmentalMetricPdf(metricId, type)
      .subscribe({
        next: (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          window.open(url);
        },
        error: (error: any) => {
          console.error(`Error loading ${type} PDF`, error);
        },
      });
  }

  onSubmit(nextRoute?: string): void {
    if (this.envMetricsForm.valid) {
      const environmentalMetric = {
        ...this.envMetricsForm.value,
        ...this.generalDataFormGroup.value,
        ...this.energyFormGroup.value,
        ...this.transportationFormGroup.value,
        ...this.wasteFormGroup.value,
      };

      if (this.metricId) {
        this.enviromentalMetricsService
          .updateEnvironmentalMetric(this.metricId, environmentalMetric)
          .subscribe({
            next: (response) => {
              this.snackBar.open(
                'Environmental Metrics updated successfully',
                'Close',
                { duration: 3000 }
              );
              if (nextRoute) {
                this.router.navigate([nextRoute], {
                  queryParams: {
                    companyId: response.company_id,
                    year: response.year,
                    metricId: response.id,
                  },
                });
              } else {
                this.router.navigate([`/extra/my-metrics`], {
                  queryParams: { id: this.companyId },
                });
              }
            },
            error: (error) => {
              this.snackBar.open(
                'Failed to update Environmental Metrics',
                'Close',
                { duration: 3000 }
              );
              console.error('Error updating Environmental Metrics', error);
            },
          });
      } else {
        this.enviromentalMetricsService
          .createEnvironmentalMetric(environmentalMetric)
          .subscribe({
            next: (response) => {
              this.snackBar.open(
                'Environmental Metrics created successfully',
                'Close',
                { duration: 3000 }
              );
              this.router.navigate([`/extra/social_metrics`], {
                queryParams: {
                  companyId: response.company_id,
                  year: response.year,
                },
              });
            },
            error: (error) => {
              this.snackBar.open(
                'Failed to create Environmental Metrics',
                'Close',
                { duration: 3000 }
              );
              console.error('Error creating Environmental Metrics', error);
            },
          });
      }
    } else {
      this.snackBar.open('An error occured. Please try again later', 'Close', {
        duration: 3000,
      });
    }
  }
}
