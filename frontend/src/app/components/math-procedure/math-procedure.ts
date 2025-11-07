// src/app/components/math-procedure/math-procedure.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProcedureStep {
  number: string;
  title: string;
  formula?: string;
  calculation?: string;
  result: string;
  explanation: string;
}

@Component({
  selector: 'app-math-procedure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './math-procedure.html',
  styleUrls: ['./math-procedure.scss']
})
export class MathProcedureComponent implements OnInit {
  @Input() simulationData: any = null;
  @Input() patientData: any = null;
  @Input() medicationData: any = null;

  steps: ProcedureStep[] = [];

  ngOnInit() {
    if (this.simulationData && this.patientData && this.medicationData) {
      this.generateProcedure();
    }
  }

  ngOnChanges() {
    if (this.simulationData && this.patientData && this.medicationData) {
      this.generateProcedure();
    }
  }

  generateProcedure() {
    this.steps = [];

    const weight = this.patientData.weight;
    const age = this.patientData.age;
    const sex = this.patientData.sex;
    const creatinine = this.patientData.serum_creatinine;
    const gfr = this.patientData.calculated_gfr;
    const stage = this.patientData.renal_stage;
    const dose = this.medicationData.dose;
    const medication = this.medicationData.medication;
    const C0 = this.simulationData.initial_conditions.C0;
    const k = this.simulationData.parameters.k;
    const halfLife = 0.693 / k;

    // PASO 1: EVALUACIÓN RENAL
    this.steps.push({
      number: '1️⃣',
      title: 'Evaluación de la Función Renal',
      formula: 'TFG = [(140 - edad) × peso × factor_sexo] / (72 × creatinina)',
      calculation: `TFG = [(140 - ${age}) × ${weight} × ${sex === 'M' ? '1.0' : '0.85'}] / (72 × ${creatinine})`,
      result: `TFG = ${gfr.toFixed(2)} mL/min`,
      explanation: `El paciente tiene ${stage}, lo que indica una función renal ${this.getRenalDescription(stage)}.`
    });

    // PASO 2: AJUSTE DE DOSIS
    const adjustmentFactor = this.getAdjustmentFactor(stage);
    const standardDose = dose / adjustmentFactor;
    
    this.steps.push({
      number: '2️⃣',
      title: 'Ajuste de Dosis por Función Renal',
      formula: 'Dosis_ajustada = Dosis_estándar × Factor_ajuste',
      calculation: `${dose} mg = ${standardDose.toFixed(0)} mg × ${adjustmentFactor}`,
      result: `Dosis ajustada: ${dose} mg (${(adjustmentFactor * 100).toFixed(0)}% de la dosis estándar)`,
      explanation: `Para pacientes con ${stage}, se reduce la dosis a ${(adjustmentFactor * 100).toFixed(0)}% para prevenir acumulación y toxicidad.`
    });

    // PASO 3: VOLUMEN DE DISTRIBUCIÓN
    const V = weight * 0.95;
    
    this.steps.push({
      number: '3️⃣',
      title: 'Cálculo del Volumen de Distribución',
      formula: 'V = Peso × Factor_distribución',
      calculation: `V = ${weight} kg × 0.95 L/kg`,
      result: `V = ${V.toFixed(2)} L`,
      explanation: 'El volumen de distribución representa el espacio corporal donde se distribuye el medicamento.'
    });

    // PASO 4: CONCENTRACIÓN INICIAL
    this.steps.push({
      number: '4️⃣',
      title: 'Concentración Inicial en Plasma',
      formula: 'C₀ = Dosis / Volumen',
      calculation: `C₀ = ${dose} mg / ${V.toFixed(2)} L`,
      result: `C₀ = ${C0.toFixed(3)} mg/L`,
      explanation: 'Esta es la concentración del medicamento inmediatamente después de la administración.'
    });

    // PASO 5: AJUSTE DE CONSTANTE DE ELIMINACIÓN
    const k_base = this.getMedicationBaseK(medication);
    
    this.steps.push({
      number: '5️⃣',
      title: 'Ajuste de Constante de Eliminación',
      formula: 'k_ajustada = k_base × Factor_renal',
      calculation: `k = ${k_base.toFixed(3)} × ${adjustmentFactor}`,
      result: `k = ${k.toFixed(3)} /hora`,
      explanation: `La función renal comprometida reduce la velocidad de eliminación del medicamento.`
    });

    // PASO 6: ECUACIÓN DIFERENCIAL
    this.steps.push({
      number: '6️⃣',
      title: 'Ecuación Diferencial de Primer Orden',
      formula: 'dC/dt = -k·C',
      calculation: `
        Separación de variables:
        dC/C = -k·dt
        
        Integración:
        ∫(dC/C) = ∫(-k·dt)
        ln(C) = -kt + C₁
        
        Aplicando condiciones iniciales C(0) = C₀:
        ln(C₀) = C₁
      `,
      result: `C(t) = C₀·e^(-k·t)`,
      explanation: 'Esta ecuación describe cómo disminuye la concentración del medicamento con el tiempo.'
    });

    // PASO 7: SOLUCIÓN PARTICULAR
    this.steps.push({
      number: '7️⃣',
      title: 'Solución Particular del Sistema',
      formula: 'C(t) = C₀·e^(-k·t)',
      calculation: `C(t) = ${C0.toFixed(3)}·e^(-${k.toFixed(3)}·t)`,
      result: `Función de concentración vs tiempo`,
      explanation: 'Esta es la solución analítica que describe la farmacocinética del medicamento en este paciente.'
    });

    // PASO 8: VIDA MEDIA
    this.steps.push({
      number: '8️⃣',
      title: 'Vida Media del Medicamento',
      formula: 't½ = ln(2) / k',
      calculation: `t½ = 0.693 / ${k.toFixed(3)}`,
      result: `t½ = ${halfLife.toFixed(2)} horas`,
      explanation: 'Tiempo necesario para que la concentración se reduzca a la mitad.'
    });

    // PASO 9: PRÓXIMA DOSIS
    const therapeuticMin = 2;
    const nextDoseTime = -Math.log(therapeuticMin / C0) / k;
    
    this.steps.push({
      number: '9️⃣',
      title: 'Cálculo de Próxima Dosis',
      formula: 't = -ln(C_min / C₀) / k',
      calculation: `
        Nivel terapéutico mínimo: ${therapeuticMin} mg/L
        ${therapeuticMin} = ${C0.toFixed(3)}·e^(-${k.toFixed(3)}·t)
        
        Despejando t:
        ln(${therapeuticMin}/${C0.toFixed(3)}) = -${k.toFixed(3)}·t
        t = ${Math.log(therapeuticMin/C0).toFixed(3)} / (-${k.toFixed(3)})
      `,
      result: `t = ${nextDoseTime.toFixed(2)} horas`,
      explanation: `El medicamento alcanzará el nivel terapéutico mínimo en ${this.formatTime(nextDoseTime)}.`
    });
  }

  getRenalDescription(stage: string): string {
    const descriptions: any = {
      'Estadio 1': 'normal o alta',
      'Estadio 2': 'levemente disminuida',
      'Estadio 3A': 'moderadamente disminuida',
      'Estadio 3B': 'moderada a severamente disminuida',
      'Estadio 4': 'severamente disminuida',
      'Estadio 5': 'falla renal terminal'
    };
    return descriptions[stage] || 'comprometida';
  }

  getAdjustmentFactor(stage: string): number {
    const factors: any = {
      'Estadio 1': 1.0,
      'Estadio 2': 0.9,
      'Estadio 3A': 0.75,
      'Estadio 3B': 0.5,
      'Estadio 4': 0.25,
      'Estadio 5': 0.1
    };
    return factors[stage] || 1.0;
  }

  getMedicationBaseK(medication: string): number {
    const medications: any = {
      'paracetamol': 0.231,
      'ibuprofeno': 0.347,
      'tramadol': 0.116,
      'morfina': 0.231,
      'amoxicilina': 0.693,
      'ceftriaxona': 0.087,
      'vancomicina': 0.116,
      'gentamicina': 0.277,
      'levofloxacino': 0.099,
      'enalapril': 0.063,
      'digoxina': 0.019,
      'atenolol': 0.107,
      'metformina': 0.139,
      'gabapentina': 0.116
    };
    return medications[medication] || 0.231;
  }

  formatTime(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutos`;
    } else {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return m > 0 ? `${h}h ${m}min` : `${h} horas`;
    }
  }
}