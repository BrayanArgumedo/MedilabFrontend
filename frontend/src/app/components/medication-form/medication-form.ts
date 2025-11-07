//src/app/components/medication-form/medication-form.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MedicationData {
  medication: string;
  dose: number;
  route: string;
}

interface Medication {
  id: string;
  name: string;
  half_life: number;
  k: number;
  category: string;
  nephrotoxic: boolean;
  warning: string;
  adjustments: {
    stage1: number;
    stage2: number;
    stage3a: number;
    stage3b: number;
    stage4: number;
    stage5: number;
  };
}

@Component({
  selector: 'app-medication-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medication-form.html',
  styleUrls: ['./medication-form.scss']
})
export class MedicationFormComponent {
  @Input() patientData: any = null;
  @Output() dataSubmitted = new EventEmitter<MedicationData>();
  @Output() back = new EventEmitter<void>();

  medicationData: MedicationData = {
    medication: '',
    dose: 500,
    route: 'iv'
  };

  medications: Medication[] = [
    // ANALGÉSICOS
    {
      id: 'paracetamol',
      name: 'Paracetamol IV',
      half_life: 3,
      k: 0.231,
      category: 'Analgésico',
      nephrotoxic: false,
      warning: 'Usar con precaución en insuficiencia hepática.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.75, stage3b: 0.5, stage4: 0.25, stage5: 0.1 }
    },
    {
      id: 'ibuprofeno',
      name: 'Ibuprofeno Oral',
      half_life: 2,
      k: 0.347,
      category: 'AINE',
      nephrotoxic: true,
      warning: '⚠️ NEFROTÓXICO. Evitar en ERC moderada-severa.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.5, stage3b: 0.0, stage4: 0.0, stage5: 0.0 }
    },
    {
      id: 'tramadol',
      name: 'Tramadol IV',
      half_life: 6,
      k: 0.116,
      category: 'Opioide',
      nephrotoxic: false,
      warning: 'Reducir dosis en ERC severa. Riesgo de acumulación.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.75, stage3b: 0.5, stage4: 0.25, stage5: 0.1 }
    },
    {
      id: 'morfina',
      name: 'Morfina IV',
      half_life: 3,
      k: 0.231,
      category: 'Opioide',
      nephrotoxic: false,
      warning: 'Metabolitos activos se acumulan en ERC. Monitoreo estrecho.',
      adjustments: { stage1: 1.0, stage2: 0.8, stage3a: 0.6, stage3b: 0.4, stage4: 0.2, stage5: 0.1 }
    },

    // ANTIBIÓTICOS
    {
      id: 'amoxicilina',
      name: 'Amoxicilina Oral',
      half_life: 1,
      k: 0.693,
      category: 'Antibiótico β-lactámico',
      nephrotoxic: false,
      warning: 'Ajustar intervalo en ERC moderada-severa.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.75, stage3b: 0.5, stage4: 0.25, stage5: 0.1 }
    },
    {
      id: 'ceftriaxona',
      name: 'Ceftriaxona IV',
      half_life: 8,
      k: 0.087,
      category: 'Antibiótico Cefalosporina',
      nephrotoxic: false,
      warning: 'Ajuste mínimo requerido. Eliminación dual (hepática y renal).',
      adjustments: { stage1: 1.0, stage2: 1.0, stage3a: 0.9, stage3b: 0.75, stage4: 0.5, stage5: 0.5 }
    },
    {
      id: 'vancomicina',
      name: 'Vancomicina IV',
      half_life: 6,
      k: 0.116,
      category: 'Antibiótico Glucopéptido',
      nephrotoxic: true,
      warning: '⛔ NEFROTÓXICO. Medir niveles valle. Riesgo de daño renal.',
      adjustments: { stage1: 1.0, stage2: 0.8, stage3a: 0.6, stage3b: 0.4, stage4: 0.2, stage5: 0.1 }
    },
    {
      id: 'gentamicina',
      name: 'Gentamicina IV',
      half_life: 2.5,
      k: 0.277,
      category: 'Antibiótico Aminoglucósido',
      nephrotoxic: true,
      warning: '⛔ ALTAMENTE NEFROTÓXICO. Contraindicado en ERC 4-5.',
      adjustments: { stage1: 1.0, stage2: 0.8, stage3a: 0.5, stage3b: 0.0, stage4: 0.0, stage5: 0.0 }
    },
    {
      id: 'levofloxacino',
      name: 'Levofloxacino Oral',
      half_life: 7,
      k: 0.099,
      category: 'Antibiótico Fluoroquinolona',
      nephrotoxic: false,
      warning: 'Ajustar dosis en ERC moderada-severa.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.75, stage3b: 0.5, stage4: 0.25, stage5: 0.1 }
    },

    // CARDIOVASCULARES
    {
      id: 'enalapril',
      name: 'Enalapril Oral',
      half_life: 11,
      k: 0.063,
      category: 'IECA (Antihipertensivo)',
      nephrotoxic: false,
      warning: '⚠️ Monitoreo de potasio. Riesgo de hiperkalemia en ERC.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.75, stage3b: 0.5, stage4: 0.25, stage5: 0.1 }
    },
    {
      id: 'digoxina',
      name: 'Digoxina Oral',
      half_life: 36,
      k: 0.019,
      category: 'Glucósido Cardíaco',
      nephrotoxic: false,
      warning: '⛔ ALTA acumulación en ERC. Riesgo de toxicidad. Medir niveles.',
      adjustments: { stage1: 1.0, stage2: 0.75, stage3a: 0.5, stage3b: 0.25, stage4: 0.1, stage5: 0.05 }
    },
    {
      id: 'atenolol',
      name: 'Atenolol Oral',
      half_life: 6.5,
      k: 0.107,
      category: 'β-bloqueador',
      nephrotoxic: false,
      warning: 'Ajustar en ERC. Eliminación principalmente renal.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.75, stage3b: 0.5, stage4: 0.25, stage5: 0.1 }
    },

    // OTROS
    {
      id: 'metformina',
      name: 'Metformina Oral',
      half_life: 5,
      k: 0.139,
      category: 'Antidiabético',
      nephrotoxic: false,
      warning: '⛔ CONTRAINDICADO en TFG < 30. Riesgo de acidosis láctica.',
      adjustments: { stage1: 1.0, stage2: 0.9, stage3a: 0.5, stage3b: 0.0, stage4: 0.0, stage5: 0.0 }
    },
    {
      id: 'gabapentina',
      name: 'Gabapentina Oral',
      half_life: 6,
      k: 0.116,
      category: 'Anticonvulsivante',
      nephrotoxic: false,
      warning: 'Requiere ajuste importante en ERC. Eliminación 100% renal.',
      adjustments: { stage1: 1.0, stage2: 0.8, stage3a: 0.6, stage3b: 0.4, stage4: 0.2, stage5: 0.1 }
    }
  ];

  routes = [
    { value: 'iv', label: 'Intravenosa (IV)' },
    { value: 'oral', label: 'Oral' },
    { value: 'im', label: 'Intramuscular (IM)' },
    { value: 'sc', label: 'Subcutánea (SC)' }
  ];

  getSelectedMedication(): Medication | undefined {
    return this.medications.find(m => m.id === this.medicationData.medication);
  }

  getAdjustedDose(): number {
    const med = this.getSelectedMedication();
    if (!med || !this.patientData) return this.medicationData.dose;

    const stage = this.patientData.renal_stage || 'Estadio 1';
    let adjustment = 1.0;

    switch(stage) {
      case 'Estadio 1': adjustment = med.adjustments.stage1; break;
      case 'Estadio 2': adjustment = med.adjustments.stage2; break;
      case 'Estadio 3A': adjustment = med.adjustments.stage3a; break;
      case 'Estadio 3B': adjustment = med.adjustments.stage3b; break;
      case 'Estadio 4': adjustment = med.adjustments.stage4; break;
      case 'Estadio 5': adjustment = med.adjustments.stage5; break;
    }

    return Math.round(this.medicationData.dose * adjustment);
  }

  getAdjustmentPercentage(): number {
    const med = this.getSelectedMedication();
    if (!med || !this.patientData) return 100;

    const stage = this.patientData.renal_stage || 'Estadio 1';
    let adjustment = 1.0;

    switch(stage) {
      case 'Estadio 1': adjustment = med.adjustments.stage1; break;
      case 'Estadio 2': adjustment = med.adjustments.stage2; break;
      case 'Estadio 3A': adjustment = med.adjustments.stage3a; break;
      case 'Estadio 3B': adjustment = med.adjustments.stage3b; break;
      case 'Estadio 4': adjustment = med.adjustments.stage4; break;
      case 'Estadio 5': adjustment = med.adjustments.stage5; break;
    }

    return Math.round(adjustment * 100);
  }

  isContraindicated(): boolean {
    return this.getAdjustmentPercentage() === 0;
  }

  getAlertLevel(): string {
    const med = this.getSelectedMedication();
    if (!med) return 'safe';

    if (this.isContraindicated()) return 'contraindicated';
    if (med.nephrotoxic) return 'danger';
    if (this.getAdjustmentPercentage() < 50) return 'warning';
    return 'safe';
  }

  onSubmit() {
    if (this.isValid() && !this.isContraindicated()) {
      this.dataSubmitted.emit(this.medicationData);
    }
  }

  onBack() {
    this.back.emit();
  }

  isValid(): boolean {
    return this.medicationData.medication !== '' &&
           this.medicationData.dose > 0 &&
           this.medicationData.route !== '';
  }

    getSelectedRoute(): string {
    const route = this.routes.find(r => r.value === this.medicationData.route);
    return route ? route.label : '';
  }

}