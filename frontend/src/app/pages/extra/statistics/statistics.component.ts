import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { CompanyService } from '../../../services/company.service';
import { User } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CO2EmissionsService } from '../../../services/co2emissions.service';
import { RouterModule } from '@angular/router';
import { IndustryPieChartComponent } from '../../../components/industry-pie-chart/industry-pie-chart.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MaterialModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public loading: boolean = true;

  public areaChartOptions: Partial<ChartOptions> | any = {};
  public columnChartOptions: Partial<ChartOptions> | any = {};
  public co2EmissionsChartOptions: Partial<ChartOptions> | any = {};
  public co2EmissionsPerSquareMeterChartOptions: Partial<ChartOptions> | any = {};
  public genderRatioChartOptions: Partial<ChartOptions> | any;
  public compensationRatioChartOptions: Partial<ChartOptions> | any;
  public totalCO2ChartOptions: Partial<ChartOptions> | any;
  public co2PerPersonChartOptions: Partial<ChartOptions> | any = {};
  public turnoverRateChartOptions: Partial<ChartOptions> | any;
  public turnoverRateYear: number | null = null;

  public genderRatioYear: number | null = null;
  public compensationRatioYear: number | null = null;

  companyId: number | null = null;
  year: number | null = null;

  @Input() set selectedYear(val: number | null) {
    this.year = val;
    if (this.companyId) {
      this.loadAllCharts(this.companyId, this.year);
    }
  }
  @Input() set selectedCompanyId(val: number | null) {
    this.companyId = val;
    if (this.companyId) {
      this.loadAllCharts(this.companyId, this.year);
    }
  }

  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
    private co2EmissionsService: CO2EmissionsService
  ) {}

  ngOnInit(): void {
    this.authService.getCompanyId().subscribe((id: number | null) => {
      if (id) {
        this.companyId = id;
        this.loadAllCharts(this.companyId, this.year);
      }
    });
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
      }
    }, 10000);
  }

  loadAllCharts(companyId: number, year?: number | null): void {
    this.loading = true;
    let completed = 0;
    const total = 8;
    const done = () => {
      completed++;
      if (completed === total) {
        this.loading = false;
      }
    };
    this.loadWasteData(companyId, year, done);
    this.loadCarData(companyId, year, done);
    this.loadCO2EmissionsData(companyId, year, done);
    this.loadGenderRatio(companyId, year, done);
    this.loadCompensationRatio(companyId, year, done);
    this.loadTotalCO2Consumption(companyId, year, done);
    this.loadCO2PerPersonData(companyId, undefined, done);
    this.loadTurnoverRate(companyId, year, done);
  }

  loadWasteData(companyId: number, year?: number | null, done?: () => void): void {
    this.companyService.getWasteDataByYear(companyId, year ?? undefined).subscribe({
      next: (data: any) => {
        const years = data.map((item: any) => item.year);
        const hazardousWaste = data.map(
          (item: any) => item.total_hazardous_waste
        );
        const nonHazardousWaste = data.map(
          (item: any) => item.total_non_hazardous_waste
        );
        this.areaChartOptions = {
          series: [
            {
              name: 'Hazardous Waste',
              data: hazardousWaste,
            },
            {
              name: 'Non-Hazardous Waste',
              data: nonHazardousWaste,
            },
          ],
          chart: {
            type: 'area',
            fontFamily: 'inherit',
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
            height: 300,
          },
          colors: ['#FF4560', '#00E396'],
          stroke: {
            curve: 'smooth',
            width: 2,
          },
          xaxis: {
            categories: years,
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: false,
            },
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function (val: any) {
                return val + ' kg';
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return val + ' kg';
            },
          },
        };
      },
      error: (err) => {
        this.areaChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }

  loadCarData(companyId: number, year?: number | null, done?: () => void): void {
    this.companyService.getCarDataByYear(companyId, year ?? undefined).subscribe({
      next: (data: any) => {
        const years = data.map((item: any) => item.year);
        const carDieselConsumption = data.map(
          (item: any) => item.total_car_diesel_consumption
        );
        const carElectric = data.map((item: any) => item.total_car_electric);
        const carFuel = data.map((item: any) => item.total_car_fuel);
        this.columnChartOptions = {
          series: [
            {
              name: 'Diesel Car Consumption',
              data: carDieselConsumption,
            },
            {
              name: 'Electric Car Consumption',
              data: carElectric,
            },
            {
              name: 'Fuel Car Consumption',
              data: carFuel,
            },
          ],
          chart: {
            type: 'bar',
            fontFamily: 'inherit',
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
            height: 300,
          },
          colors: ['#008FFB', '#00E396', '#FEB019'],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded',
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: years,
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: false,
            },
          },
          tooltip: {
            theme: 'dark',
          },
        };
      },
      error: (err) => {
        this.columnChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }

  loadCO2EmissionsData(companyId: number, year?: number | null, done?: () => void): void {
    this.co2EmissionsService.getConsumptionDataByYear(companyId, year ?? undefined).subscribe({
      next: (data: any) => {
          const co2EmissionsData =
            this.co2EmissionsService.calculateCO2Emissions(data);
          const years = co2EmissionsData.map((item: any) => item.year);
          const carDieselCO2 = co2EmissionsData.map(
            (item: any) => item.carDieselCO2
          );
          const carElectricCO2 = co2EmissionsData.map(
            (item: any) => item.carElectricCO2
          );
          const carFuelCO2 = co2EmissionsData.map((item: any) => item.carFuelCO2);
          const electricityCO2 = co2EmissionsData.map(
            (item: any) => item.electricityCO2
          );
          const gasCO2 = co2EmissionsData.map((item: any) => item.gasCO2);
          this.co2EmissionsChartOptions = {
            series: [
              {
                name: 'Diesel Car CO2 Emissions',
                data: carDieselCO2,
              },
              {
                name: 'Electric Car CO2 Emissions',
                data: carElectricCO2,
              },
              {
                name: 'Fuel Car CO2 Emissions',
                data: carFuelCO2,
              },
              {
                name: 'Electricity CO2 Emissions',
                data: electricityCO2,
              },
              {
                name: 'Gas CO2 Emissions',
                data: gasCO2,
              },
            ],
            chart: {
              type: 'line',
              fontFamily: 'inherit',
              foreColor: '#adb0bb',
              toolbar: {
                show: false,
              },
              height: 300,
            },
            colors: ['#FF4560', '#00E396', '#FEB019', '#775DD0'],
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
              },
            },
            dataLabels: {
              enabled: true,
              formatter: function (val: any) {
                return val + ' Tones';
              },
            },
            xaxis: {
              categories: years,
              axisBorder: {
                show: true,
              },
              axisTicks: {
                show: false,
              },
            },
            tooltip: {
              theme: 'dark',
              y: {
                formatter: function (val: any) {
                  return val + ' Tones';
                },
              },
            },
          };
        },
      error: (err) => {
        this.co2EmissionsChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }

  loadGenderRatio(companyId: number, year?: number | null, done?: () => void): void {
    const yearParam = typeof year === 'number' ? year : undefined;
    this.companyService.getGenderRatio(companyId, yearParam).subscribe({
      next: (data: any) => {
        this.genderRatioYear = data.year;
        this.genderRatioChartOptions = {
          series: [data.male_employees, data.female_employees],
          chart: {
            type: 'pie',
            height: 350,
          },
          labels: ['Male Employees', 'Female Employees'],
          dataLabels: {
            enabled: true,
          },
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
              },
            },
          },
          tooltip: {
            theme: 'dark',
          },
          fill: {
            type: 'gradient',
          },
          legend: {
            position: 'bottom',
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };
      },
      error: (err) => {
        this.genderRatioChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }

  loadCompensationRatio(companyId: number, year?: number | null, done?: () => void): void {
    const yearParam = typeof year === 'number' ? year : undefined;
    this.companyService.getCompensationRatio(companyId, yearParam).subscribe({
      next: (data: any) => {
          this.compensationRatioYear = data.year;
          this.compensationRatioChartOptions = {
            series: [
              data.ceo_total_compensation,
              data.median_employee_total_compensation,
            ],
            chart: {
              type: 'donut',
              height: 350,
            },
            labels: ['CEO Compensation', 'Median Employee Compensation'],
            dataLabels: {
              enabled: true,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '70%',
                },
              },
            },
            tooltip: {
              theme: 'dark',
            },
            fill: {
              type: 'gradient',
            },
            legend: {
              position: 'bottom',
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          };
        },
      error: (err) => {
        this.compensationRatioChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }

  loadTotalCO2Consumption(companyId: number, year?: number | null, done?: () => void): void {
    const yearParam = typeof year === 'number' ? year : undefined;
    this.co2EmissionsService.getCO2Emissions(companyId, yearParam).subscribe({
      next: (data: any) => {
          const years = data.map((item: any) => item.year);
          const totalCO2 = data.map((item: any) => item.total_co2);
          this.totalCO2ChartOptions = {
            series: [
              {
                name: 'Total CO2 Consumption',
                data: totalCO2,
              },
            ],
            chart: {
              type: 'line',
              height: 300,
            },
            xaxis: {
              categories: years,
            },
            tooltip: {
              theme: 'dark',
              y: {
                formatter: function (val: any) {
                  return val + ' kgCo2';
                },
              },
            },
          };
        },
      error: (err) => {
        this.totalCO2ChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }

  loadCO2PerPersonData(companyId: number, _year?: number | null, done?: () => void): void {
    this.co2EmissionsService.getCO2ConsumptionPerPerson(companyId).subscribe({
      next: (data: any) => {
          const years = data.map((item: any) => item.year);
          const co2PerPerson = data.map((item: any) => item.co2_per_person);
          this.co2PerPersonChartOptions = {
            series: [
              {
                name: 'CO2 Consumption per Person in kgs',
                data: co2PerPerson,
              },
            ],
            chart: {
              type: 'bar',
              height: 300,
            },
            xaxis: {
              categories: years,
              title: {
                text: 'Year',
              },
            },
            dataLabels: {
              enabled: true,
              formatter: function (val: any) {
                return val + ' kgs';
              },
            },
            tooltip: {
              theme: 'dark',
              y: {
                formatter: function (val: any) {
                  return val + ' kgs';
                },
              },
            },
          };
        },
      error: (err) => {
        this.co2PerPersonChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }

  loadTurnoverRate(companyId: number, year?: number | null, done?: () => void): void {
    const yearParam = typeof year === 'number' ? year : undefined;
    this.companyService.getTurnoverRate(companyId, yearParam).subscribe({
      next: (data: any) => {
        this.turnoverRateYear = data.year;
        this.turnoverRateChartOptions = {
          series: [data.voluntary_turnover ?? 0, data.involuntary_turnover ?? 0],
          chart: {
            type: 'pie',
            height: 350,
          },
          labels: ['Voluntary Turnover (%)', 'Involuntary Turnover (%)'],
          dataLabels: {
            enabled: true,
          },
          tooltip: {
            theme: 'dark',
          },
          legend: {
            position: 'bottom',
          },
        };
      },
      error: (err) => {
        this.turnoverRateChartOptions = { series: [] };
        if (done) done();
      },
      complete: () => { if (done) done(); }
    });
  }
}
