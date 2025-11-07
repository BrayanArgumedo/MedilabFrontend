import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.html',
  styleUrls: ['./stepper.scss']
})
export class StepperComponent {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 4;

  steps = [
    { number: 1, label: 'Paciente', icon: '👤', description: 'Datos del paciente' },
    { number: 2, label: 'Medicamento', icon: '💊', description: 'Dosis y medicamento' },
    { number: 3, label: 'Configuración', icon: '⚙️', description: 'Parámetros de análisis' },
    { number: 4, label: 'Resultados', icon: '📊', description: 'Visualización' }
  ];

  isCompleted(stepNumber: number): boolean {
    return stepNumber < this.currentStep;
  }

  isActive(stepNumber: number): boolean {
    return stepNumber === this.currentStep;
  }

  isPending(stepNumber: number): boolean {
    return stepNumber > this.currentStep;
  }
}