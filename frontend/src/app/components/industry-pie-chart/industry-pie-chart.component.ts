import { Component, ViewChild } from '@angular/core';
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
import { MaterialModule } from '../../material.module';
import { CompanyService } from '../../services/company.service';
import { CommonModule } from '@angular/common';
import { delay } from 'rxjs/operators';

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
  selector: 'app-industry-pie-chart',
  standalone: true,
  imports: [CommonModule,NgApexchartsModule, MaterialModule],
  templateUrl: './industry-pie-chart.component.html',
})
export class IndustryPieChartComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public pieChartOptions: Partial<ChartOptions> | any;
  public loading: boolean = true;


  constructor(private companyService: CompanyService) {
    this.pieChartOptions = {
      series: [],
      chart: {
        id: 'pie-chart',
        type: 'pie',
        height: 350,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70px',
          },
        },
      },
      legend: {
        show: true,
        position: 'bottom',
        width: '50px',
      },
      colors: ['#5D87FF', '#ECF2FF', '#49BEFF', '#E8F7FF', '#FFAE1F'],
      tooltip: {
        fillSeriesColor: false,
      },
      labels: {
        enabled: true,
        formatter: (val: string, opts: { seriesIndex: number }) => {
          return this.pieChartOptions.labels[opts.seriesIndex];
        },
      },
    };
  }

  ngOnInit(): void {
    this.companyService.getIndustries().pipe(delay(1000)).subscribe((data) => {
      this.pieChartOptions.series = data.map((item) => item.count);
      this.pieChartOptions.labels = data.map((item) => item.industry);
      this.loading = false;
    });
  }

}
