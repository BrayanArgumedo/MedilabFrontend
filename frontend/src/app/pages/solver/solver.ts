//src/app/pages/solver/solver.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolverFormComponent } from '../../components/solver-form/solver-form';
import { ChartDisplayComponent } from '../../components/chart-display/chart-display';
import { ResultsPanelComponent } from '../../components/results-panel/results-panel';
import { StepperComponent } from '../../components/stepper/stepper';
import { PatientFormComponent } from '../../components/patient-form/patient-form';
import { MedicationFormComponent } from '../../components/medication-form/medication-form';
import { AnalysisConfigComponent } from '../../components/analysis-config/analysis-config';
import { ApiService } from '../../services/api';  // ← AGREGAR ESTA LÍNEA
import { NextDoseCardComponent } from '../../components/next-dose-card/next-dose-card';
import { MathProcedureComponent } from '../../components/math-procedure/math-procedure';


@Component({
  selector: 'app-solver',
  standalone: true,
  imports: [
    CommonModule, 
    SolverFormComponent, 
    ChartDisplayComponent, 
    ResultsPanelComponent,
    StepperComponent,
    PatientFormComponent,
    MedicationFormComponent,
    AnalysisConfigComponent,
    NextDoseCardComponent,
    MathProcedureComponent
  ],
  templateUrl: './solver.html',
  styleUrls: ['./solver.scss']
})

export class SolverComponent {
  // Control del wizard
  currentStep: number = 1;
  totalSteps: number = 4;

  // Datos recolectados
  patientData: any = null;
  medicationData: any = null;
  configData: any = null;
  simulationData: any = null;

  // Estados
  loading: boolean = false;
  error: string | null = null;
  activeTab: string = 'graph';  // ← AGREGAR ESTA LÍNEA

  // Inyectar el servicio
  constructor(private apiService: ApiService) {}

  // --- PASO 1: Datos del Paciente ---
  onPatientDataSubmitted(data: any) {
    console.log('✅ Datos del paciente:', data);
    this.patientData = data;
    this.nextStep();
  }

  // --- PASO 2: Medicamento ---
  onMedicationDataSubmitted(data: any) {
    console.log('✅ Datos del medicamento:', data);
    this.medicationData = data;
    this.currentStep = 3;
  }

  // --- PASO 3: Configuración + CÁLCULO ---
  onConfigDataSubmitted(data: any) {
    console.log('✅ Datos de configuración:', data);
    this.configData = data;
    
    // INTEGRACIÓN: Unir todos los datos y calcular
    this.calculateSimulation();
  }

  // 🔥 MÉTODO PRINCIPAL: CALCULAR SIMULACIÓN
  calculateSimulation() {
    this.loading = true;
    this.error = null;

    // 1. CALCULAR C0 (Concentración Inicial)
    const volumeDistribution = this.patientData.weight * 0.95; // L
    const C0 = this.medicationData.dose / volumeDistribution; // mg/L

    // 2. AJUSTAR k SEGÚN FUNCIÓN RENAL
    const selectedMed = this.getSelectedMedicationDetails();
    const k_base = selectedMed?.k || 0.231;
    const renalAdjustment = this.getRenalAdjustmentFactor();
    const k_adjusted = k_base * renalAdjustment;

    // 3. CALCULAR NUM_POINTS SEGÚN RESOLUCIÓN
    const numPoints = this.getNumPointsFromResolution();

    // 4. CONSTRUIR REQUEST PARA EL BACKEND
     const request: any = {
      medication_type: this.getMedicationModelType(this.medicationData.medication),
      patient_weight: this.patientData.weight,
      dose_administered: this.medicationData.dose,
      patient_age: this.patientData.age,
      serum_creatinine: this.patientData.serum_creatinine,
      patient_sex: this.patientData.sex,
      calculated_gfr: this.patientData.calculated_gfr,
      renal_stage: this.patientData.renal_stage,
      on_dialysis: this.patientData.on_dialysis,
      dialysis_type: this.patientData.dialysis_type,
      initial_conditions: { C0: C0 },
      time_range: [0, this.configData.timeToSimulate] as [number, number],
      parameters: { k: k_adjusted },
      num_points: numPoints
    };

    console.log('📤 Enviando request al backend:', request);

    // 5. ENVIAR AL BACKEND
    this.apiService.solveAndSave(request).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del backend:', response);
        this.loading = false;
        this.simulationData = response;
        this.currentStep = 4; // Ir a resultados
      },
      error: (err) => {
        console.error('❌ Error del backend:', err);
        this.loading = false;
        this.error = 'Error al calcular la simulación. Verifica que el backend esté corriendo.';
      }
    });
  }

  // HELPERS: Obtener detalles del medicamento seleccionado
  getSelectedMedicationDetails() {
    // Lista de medicamentos (igual que en medication-form)
    const medications = [
      { id: 'paracetamol', k: 0.231, half_life: 3 },
      { id: 'ibuprofeno', k: 0.347, half_life: 2 },
      { id: 'tramadol', k: 0.116, half_life: 6 },
      { id: 'morfina', k: 0.231, half_life: 3 },
      { id: 'amoxicilina', k: 0.693, half_life: 1 },
      { id: 'ceftriaxona', k: 0.087, half_life: 8 },
      { id: 'vancomicina', k: 0.116, half_life: 6 },
      { id: 'gentamicina', k: 0.277, half_life: 2.5 },
      { id: 'levofloxacino', k: 0.099, half_life: 7 },
      { id: 'enalapril', k: 0.063, half_life: 11 },
      { id: 'digoxina', k: 0.019, half_life: 36 },
      { id: 'atenolol', k: 0.107, half_life: 6.5 },
      { id: 'metformina', k: 0.139, half_life: 5 },
      { id: 'gabapentina', k: 0.116, half_life: 6 }
    ];

    return medications.find(m => m.id === this.medicationData.medication);
  }

  // HELPERS: Mapear medicamento al tipo de modelo de ecuación diferencial
  getMedicationModelType(medicationId: string): string {
    // Por ahora, todos los medicamentos usan el modelo de decaimiento simple
    // En el futuro, podrías agregar más modelos aquí (ej: infusion_continua para goteos IV)
    return 'decaimiento_simple';
  }

  // HELPERS: Factor de ajuste renal
  getRenalAdjustmentFactor(): number {
    const stage = this.patientData.renal_stage;
    
    switch(stage) {
      case 'Estadio 1': return 1.0;
      case 'Estadio 2': return 0.9;
      case 'Estadio 3A': return 0.75;
      case 'Estadio 3B': return 0.5;
      case 'Estadio 4': return 0.25;
      case 'Estadio 5': return 0.1;
      default: return 1.0;
    }
  }

  // HELPERS: Obtener número de puntos según resolución
  getNumPointsFromResolution(): number {
    switch(this.configData.resolution) {
      case 'low': return 20;
      case 'medium': return 50;
      case 'high': return 100;
      default: return 50;
    }
  }

  // --- SIMULACIÓN (Ya no se usa, pero lo dejamos por compatibilidad) ---
  onSimulationComplete(data: any) {
    console.log('✅ Simulación completa:', data);
    this.simulationData = data;
    this.currentStep = 4;
  }

  // Navegación
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      
      // Limpiar datos si retrocede
      if (this.currentStep === 1) {
        this.simulationData = null;
      }
    }
  }

  onCancel() {
    console.log('❌ Cancelado');
    this.currentStep = 1;
    this.patientData = null;
    this.medicationData = null;
    this.configData = null;
    this.simulationData = null;
    this.error = null;
  }
}