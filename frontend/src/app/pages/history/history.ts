//src/app/pages/history/history.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrls: ['./history.scss']
})
export class HistoryComponent implements OnInit {
  simulations: any[] = [];
  selectedSimulations: any[] = [];
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    
    this.apiService.getSimulations(100).subscribe({
      next: (data: any) => {
        console.log('✅ Historial cargado:', data);
        
        if (data.simulations) {
          this.simulations = data.simulations;
        } else if (Array.isArray(data)) {
          this.simulations = data;
        } else {
          this.simulations = [];
        }
        
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error cargando historial:', err);
        this.loading = false;
        this.simulations = [];
      }
    });
  }

  onCheckboxChange(simulation: any, event: any) {
    if (event.target.checked) {
      if (this.selectedSimulations.length < 2) {
        this.selectedSimulations.push(simulation);
      } else {
        event.target.checked = false;
        alert('Solo puedes seleccionar 2 simulaciones para comparar');
      }
    } else {
      this.selectedSimulations = this.selectedSimulations.filter(
        s => s.id !== simulation.id
      );
    }
  }

  isSelected(simulation: any): boolean {
    return this.selectedSimulations.some(s => s.id === simulation.id);
  }

  compareSelected() {
    if (this.selectedSimulations.length === 2) {
      this.router.navigate(['/compare'], {
        queryParams: {
          sim1: this.selectedSimulations[0].id,
          sim2: this.selectedSimulations[1].id
        }
      });
    }
  }

  viewSimulation(simulation: any) {
    console.log('Ver simulación:', simulation);
    // TODO: Implementar vista detallada
  }

    deleteSimulation(simulation: any) {
    if (confirm('¿Estás seguro de eliminar esta simulación?')) {
      this.apiService.deleteSimulation(simulation.id).subscribe({
        next: () => {
          console.log('✅ Simulación eliminada del backend');
          // Eliminar de la vista
          this.simulations = this.simulations.filter(s => s.id !== simulation.id);
          alert('✅ Simulación eliminada correctamente');
        },
        error: (err: any) => {
          console.error('❌ Error eliminando:', err);
          
          // Si el backend no soporta DELETE (405), eliminar solo del frontend
          if (err.status === 405 || err.status === 404) {
            console.log('⚠️ Backend no soporta DELETE, eliminando de la vista...');
            this.simulations = this.simulations.filter(s => s.id !== simulation.id);
            alert('⚠️ El backend no soporta eliminación permanente.\nSe removió de la vista (volverá al recargar).');
          } else {
            alert('❌ Error al eliminar la simulación');
          }
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
 getRenalStage(sim: any): string {
    // Si tiene renal_stage, usarlo
    if (sim.renal_stage) return sim.renal_stage;
    
    // Si tiene calculated_gfr, calcular
    const gfr = sim.calculated_gfr;
    if (gfr && gfr > 0) {
      if (gfr >= 90) return 'Estadio 1';
      if (gfr >= 60) return 'Estadio 2';
      if (gfr >= 45) return 'Estadio 3A';
      if (gfr >= 30) return 'Estadio 3B';
      if (gfr >= 15) return 'Estadio 4';
      return 'Estadio 5';
    }
    
    // Si no tiene datos, retornar vacío (mejor que N/A)
    return '--';
  }

    getMedicationName(sim: any): string {
  // ANTES: if (sim.model_type) return sim.model_type;
  // DESPUÉS:
  if (sim.medication_type) return sim.medication_type;
  return '--';
}

  newSimulation() {
    this.router.navigate(['/solver']);
  }
}