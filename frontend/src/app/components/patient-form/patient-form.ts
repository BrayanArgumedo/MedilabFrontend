import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PatientData {
  weight: number;
  age: number | null;
  sex: 'M' | 'F';
  serum_creatinine: number;
  on_dialysis: boolean;
  dialysis_type: string;
  calculated_gfr: number;
  renal_stage: string;
  renal_function: string;
}

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-form.html',
  styleUrls: ['./patient-form.scss']
})
export class PatientFormComponent {
  @Output() dataSubmitted = new EventEmitter<PatientData>();
  @Output() cancel = new EventEmitter<void>();

  patientData: PatientData = {
    weight: 70,
    age: 65,
    sex: 'M',
    serum_creatinine: 1.2,
    on_dialysis: false,
    dialysis_type: '',
    calculated_gfr: 0,
    renal_stage: '',
    renal_function: 'normal'
  };

  renalStages = [
    { 
      stage: 'Estadio 1', 
      gfr_range: '≥ 90', 
      severity: 'ERC Leve',
      adjustment: 1.0,
      color: '#10B981',
      monitoring: 'Semestral'
    },
    { 
      stage: 'Estadio 2', 
      gfr_range: '60-89', 
      severity: 'ERC Leve-Moderada',
      adjustment: 0.9,
      color: '#3B82F6',
      monitoring: 'Trimestral'
    },
    { 
      stage: 'Estadio 3A', 
      gfr_range: '45-59', 
      severity: 'ERC Moderada',
      adjustment: 0.75,
      color: '#F59E0B',
      monitoring: 'Mensual'
    },
    { 
      stage: 'Estadio 3B', 
      gfr_range: '30-44', 
      severity: 'ERC Moderada-Severa',
      adjustment: 0.5,
      color: '#F97316',
      monitoring: 'Quincenal'
    },
    { 
      stage: 'Estadio 4', 
      gfr_range: '15-29', 
      severity: 'ERC Severa',
      adjustment: 0.25,
      color: '#EF4444',
      monitoring: 'Semanal'
    },
    { 
      stage: 'Estadio 5', 
      gfr_range: '< 15', 
      severity: 'Falla Renal Terminal',
      adjustment: 0.1,
      color: '#991B1B',
      monitoring: 'Diálisis requerida'
    }
  ];

  dialysisTypes = [
    { value: 'none', label: 'No aplica' },
    { value: 'hemodialysis', label: 'Hemodiálisis' },
    { value: 'peritoneal', label: 'Diálisis Peritoneal' }
  ];

  ngOnInit() {
    this.calculateGFR();
  }

  onWeightChange() {
    this.calculateGFR();
  }

  onAgeChange() {
    this.calculateGFR();
  }

  onSexChange() {
    this.calculateGFR();
  }

  onCreatinineChange() {
    this.calculateGFR();
  }

  calculateGFR() {
    const { age, weight, sex, serum_creatinine } = this.patientData;

    if (!age || !weight || !serum_creatinine || serum_creatinine <= 0) {
      this.patientData.calculated_gfr = 0;
      this.patientData.renal_stage = '';
      return;
    }

    // Fórmula de Cockcroft-Gault
    const sexFactor = sex === 'F' ? 0.85 : 1.0;
    const gfr = ((140 - age) * weight * sexFactor) / (72 * serum_creatinine);
    
    this.patientData.calculated_gfr = Math.round(gfr * 10) / 10;
    this.patientData.renal_stage = this.classifyRenalStage(gfr);
  }

  classifyRenalStage(gfr: number): string {
    if (gfr >= 90) return 'Estadio 1';
    if (gfr >= 60) return 'Estadio 2';
    if (gfr >= 45) return 'Estadio 3A';
    if (gfr >= 30) return 'Estadio 3B';
    if (gfr >= 15) return 'Estadio 4';
    return 'Estadio 5';
  }

  getCurrentStageInfo() {
    return this.renalStages.find(s => s.stage === this.patientData.renal_stage);
  }

  getAlertLevel(): string {
    const gfr = this.patientData.calculated_gfr;
    if (gfr >= 60) return 'safe';
    if (gfr >= 30) return 'warning';
    return 'danger';
  }

  onSubmit() {
    if (this.isValid()) {
      this.dataSubmitted.emit(this.patientData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  isValid(): boolean {
    return this.patientData.weight > 0 && 
           this.patientData.weight < 500 &&
           this.patientData.age !== null &&
           this.patientData.age > 0 &&
           this.patientData.serum_creatinine > 0 &&
           this.patientData.calculated_gfr > 0;
  }
}