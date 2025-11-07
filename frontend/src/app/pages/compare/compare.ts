//src/app/pages/compare/compare.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare.html',
  styleUrls: ['./compare.scss']
})
export class CompareComponent implements OnInit {
  simulation1: any = null;
  simulation2: any = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const sim1Id = params['sim1'];
      const sim2Id = params['sim2'];
      
      if (sim1Id && sim2Id) {
        this.loadComparison(sim1Id, sim2Id);
      } else {
        this.router.navigate(['/history']);
      }
    });
  }

  loadComparison(id1: number, id2: number) {
    this.loading = true;
    
    // Cargar ambas simulaciones en paralelo usando forkJoin
    forkJoin({
      sim1: this.apiService.getSimulationById(id1),
      sim2: this.apiService.getSimulationById(id2)
    }).subscribe({
      next: (result) => {
        console.log('✅ Simulaciones cargadas:', result);
        this.simulation1 = result.sim1;
        this.simulation2 = result.sim2;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error cargando simulaciones:', err);
        alert('Error al cargar las simulaciones');
        this.router.navigate(['/history']);
      }
    });
  }

  getDifference(value1: number, value2: number): string {
    if (!value1 || !value2) return '0.0';
    const diff = ((value2 - value1) / value1 * 100).toFixed(1);
    return diff;
  }

  getRenalStage(sim: any): string {
    if (sim.renal_stage) return sim.renal_stage;
    
    const gfr = sim.calculated_gfr;
    if (!gfr) return '--';
    
    if (gfr >= 90) return 'Estadio 1';
    if (gfr >= 60) return 'Estadio 2';
    if (gfr >= 45) return 'Estadio 3A';
    if (gfr >= 30) return 'Estadio 3B';
    if (gfr >= 15) return 'Estadio 4';
    return 'Estadio 5';
  }

  getMedicationName(sim: any): string {
  // ANTES: if (sim.model_type) return sim.model_type;
  // DESPUÉS:
  if (sim.medication_type) return sim.medication_type;
  return '--';
}

  getC0(sim: any): number {
    // Calcular C0 = Dosis / Volumen de distribución
    // Vd aproximado = peso * 0.6 L/kg (para la mayoría de medicamentos)
    if (sim.dose_administered && sim.patient_weight) {
      return sim.dose_administered / (sim.patient_weight * 0.6);
    }
    return 0;
  }

  getHalfLife(sim: any): number {
    // Vida media = ln(2) / k
    // k aproximado = 0.693 / vida_media_normal
    // Para simplificar, usamos 3 horas como default
    const gfr = sim.calculated_gfr;
    if (!gfr) return 3;
    
    // Ajustar vida media según función renal
    if (gfr >= 90) return 3;
    if (gfr >= 60) return 4;
    if (gfr >= 45) return 5;
    if (gfr >= 30) return 6;
    if (gfr >= 15) return 8;
    return 10;
  }

  backToHistory() {
    this.router.navigate(['/history']);
  }
}