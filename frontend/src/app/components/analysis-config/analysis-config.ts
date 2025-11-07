//src/app/components/analysis-config/analysis-config.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ConfigData {
  timeToSimulate: number;
  resolution: 'low' | 'medium' | 'high';
  showTherapeuticLevels: boolean;
  showProcedure: boolean;
  saveToHistory: boolean;
}

@Component({
  selector: 'app-analysis-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analysis-config.html',
  styleUrls: ['./analysis-config.scss']
})
export class AnalysisConfigComponent {
  @Input() patientData: any = null;
  @Input() medicationData: any = null;
  @Output() dataSubmitted = new EventEmitter<ConfigData>();
  @Output() back = new EventEmitter<void>();

  configData: ConfigData = {
    timeToSimulate: 12,
    resolution: 'medium',
    showTherapeuticLevels: true,
    showProcedure: true,
    saveToHistory: true
  };

   resolutionOptions: Array<{
    value: 'low' | 'medium' | 'high';
    label: string;
    points: number;
    description: string;
    icon: string;
  }> = [
    {
      value: 'low',
      label: 'Baja',
      points: 20,
      description: 'Cálculo rápido, menos preciso',
      icon: '⚡'
    },
    {
      value: 'medium',
      label: 'Media',
      points: 50,
      description: 'Balance entre velocidad y precisión',
      icon: '⚖️'
    },
    {
      value: 'high',
      label: 'Alta',
      points: 100,
      description: 'Máxima precisión, más lento',
      icon: '🎯'
    }
  ];

  getSelectedResolution() {
    return this.resolutionOptions.find(r => r.value === this.configData.resolution);
  }

  getNumPoints(): number {
    return this.getSelectedResolution()?.points || 50;
  }

  onSubmit() {
    if (this.isValid()) {
      this.dataSubmitted.emit(this.configData);
    }
  }

  onBack() {
    this.back.emit();
  }

  isValid(): boolean {
    return this.configData.timeToSimulate > 0 &&
           this.configData.timeToSimulate <= 48 &&
           this.configData.resolution !== null;
  }

  // Calcular tiempo estimado de cálculo
  getEstimatedTime(): string {
    const points = this.getNumPoints();
    const time = points * 0.05; // 0.05 segundos por punto (estimado)
    
    if (time < 1) {
      return '< 1 segundo';
    } else if (time < 60) {
      return `${Math.round(time)} segundos`;
    } else {
      return `${Math.round(time / 60)} minutos`;
    }
  }
}