import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CO2EmissionsService {
  private apiUrl = environment.apiUrl;
  kgco2PerKWh = 0.285; // grams of CO2 per kWh for Greeece 2023
  kgco2PerLitre = 2.141; // kg of CO2 per litre of gasoline for Greeece 2023
  kgco2PerDiesel = 2.47; // kg of CO2 per litre of diesel for Greeece 2023
  constructor(private http: HttpClient) {}

  getConsumptionDataByYear(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/consumption_data`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  calculateCO2Emissions(consumptionData: any[]): any[] {

    return consumptionData.map(data => ({
      year: data.year,
      carDieselCO2: (data.total_car_diesel_consumption * this.kgco2PerDiesel / 1000).toFixed(2),
      carElectricCO2: (data.total_car_electric_consumption * this.kgco2PerKWh / 1000).toFixed(2),
      carFuelCO2: (data.total_car_fuel_consumption * this.kgco2PerLitre / 1000).toFixed(2),
      electricityCO2: (data.total_electricity_consumption * this.kgco2PerKWh / 1000).toFixed(2),
      gasCO2: (data.total_gas_consumption * this.kgco2PerKWh / 1000).toFixed(2),
    }));
  }

  getCO2Emissions(companyId: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/companies/${companyId}/co2_emissions`;
    if (year !== undefined) {
      url += `?year=${year}`;
    }
    return this.http.get<any>(url);
  }

  getCO2ConsumptionPerPerson(companyId: number): Observable<any> {
    // Use the correct backend endpoint
    let url = `${this.apiUrl}/companies/${companyId}/co2_per_person_by_year`;
    return this.http.get<any>(url);
  }

}
