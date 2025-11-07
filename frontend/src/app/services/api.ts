//src/app/services/api.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolveRequest {
  medication_type: string;
  patient_weight: number;
  dose_administered: number;
  patient_age?: number;
  serum_creatinine?: number;       // NUEVO
  patient_sex?: 'M' | 'F';         // NUEVO
  calculated_gfr?: number;         // NUEVO
  renal_stage?: string;            // NUEVO
  on_dialysis?: boolean;           // NUEVO
  dialysis_type?: string;          // NUEVO
  initial_conditions: { C0: number };
  time_range: [number, number];
  parameters: { k: number };
  num_points: number;
}

export interface SolveResponse {
  time: number[];
  concentration: number[];
  medication_type: string;
  initial_conditions: { C0: number };
  parameters: any;
  statistics: {
    max_concentration: number;
    min_concentration: number;
    final_concentration: number;
    mean_concentration: number;
    half_life_hours: number | null;
    elimination_rate: number;
  };
  success: boolean;
  simulation_id?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  /**
   * Resuelve la ecuación diferencial
   */
  solve(request: SolveRequest): Observable<SolveResponse> {
    return this.http.post<SolveResponse>(`${this.apiUrl}/solver/solve`, request);
  }

  /**
   * Resuelve y guarda en la base de datos
   */
  solveAndSave(request: SolveRequest): Observable<SolveResponse> {
    return this.http.post<SolveResponse>(`${this.apiUrl}/solver/solve-and-save`, request);
  }

  /**
   * Obtiene los modelos disponibles
   */
  getModels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/solver/models`);
  }

  /**
   * Obtiene el historial de simulaciones
   */
  getSimulations(limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/solver/simulations?limit=${limit}`);
  }

  /**
   * Obtiene una simulación específica por ID
   */
  getSimulationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/solver/simulations/${id}`);
  }

  deleteSimulation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/solver/simulations/${id}`);
  }
}

