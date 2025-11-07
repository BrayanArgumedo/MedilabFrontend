//src/app/components/solver-form/solver-form.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, SolveRequest, SolveResponse } from '../../services/api';


@Component({
  selector: 'app-solver-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solver-form.html',
  styleUrls: ['./solver-form.scss']
})
export class SolverFormComponent {
  @Output() simulationComplete = new EventEmitter<SolveResponse>();

  // Modelo del formulario
  formData = {
    medication: 'paracetamol',
    C0: 20.0,
    k: 0.231,
    timeRange: 12,
    numPoints: 50
  };

  // Medicamentos predefinidos
  medications = [
    { name: 'Paracetamol IV', value: 'paracetamol', k: 0.231, description: 'Vida media: 3 horas' },
    { name: 'Ibuprofeno', value: 'ibuprofeno', k: 0.347, description: 'Vida media: 2 horas' },
    { name: 'Antibiótico', value: 'antibiotico', k: 0.15, description: 'Vida media: 4.6 horas' }
  ];

  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  /**
   * Cuando se selecciona un medicamento, actualiza k automáticamente
   */
  onMedicationChange() {
    const selected = this.medications.find(m => m.value === this.formData.medication);
    if (selected) {
      this.formData.k = selected.k;
    }
  }

  /**
   * Enviar el formulario
   */
  onSubmit() {
  this.loading = true;
  this.error = null;

  const request: SolveRequest = {
    medication_type: 'decaimiento_simple',
    patient_weight: this.formData.C0 * 3.5, // Temporal: calcular peso estimado
    dose_administered: this.formData.C0 * 3.5 * 10, // Temporal: calcular dosis estimada
    initial_conditions: { C0: this.formData.C0 },
    time_range: [0, this.formData.timeRange],
    parameters: { k: this.formData.k },
    num_points: this.formData.numPoints
  };

  this.apiService.solveAndSave(request).subscribe({
    next: (response: SolveResponse) => {
      this.loading = false;
      console.log('Resultado:', response);
      this.simulationComplete.emit(response);
    },
    error: (err) => {
      this.loading = false;
      this.error = 'Error al calcular. Verifica que el backend esté corriendo en http://localhost:8000';
      console.error('Error:', err);
    }
  });
}

  /**
   * Validaciones
   */
  isFormValid(): boolean {
    return this.formData.C0 > 0 && 
           this.formData.k > 0 && 
           this.formData.timeRange > 0;
  }
}