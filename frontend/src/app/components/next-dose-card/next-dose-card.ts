//src/app/components/next-dose-card/next-dose-card.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-next-dose-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-dose-card.html',
  styleUrls: ['./next-dose-card.scss']
})
export class NextDoseCardComponent implements OnInit {
  @Input() simulationData: any = null;

  nextDoseTime: number = 0;
  nextDoseDate: Date | null = null;
  therapeuticMinLevel: number = 2; // mg/L
  
  ngOnInit() {
    if (this.simulationData) {
      this.calculateNextDose();
    }
  }

  ngOnChanges() {
    if (this.simulationData) {
      this.calculateNextDose();
    }
  }

  calculateNextDose() {
    // Obtener C0 y k de los datos
    const C0 = this.simulationData.initial_conditions?.C0 || 0;
    const k = this.simulationData.parameters?.k || 0.231;
    
    // Calcular tiempo hasta nivel terapéutico mínimo
    // C(t) = C0 * e^(-kt)
    // therapeutic_min = C0 * e^(-kt)
    // t = -ln(therapeutic_min / C0) / k
    
    if (C0 > this.therapeuticMinLevel) {
      this.nextDoseTime = -Math.log(this.therapeuticMinLevel / C0) / k;
      
      // Calcular fecha y hora estimada
      const now = new Date();
      this.nextDoseDate = new Date(now.getTime() + this.nextDoseTime * 60 * 60 * 1000);
    } else {
      this.nextDoseTime = 0;
      this.nextDoseDate = new Date();
    }
  }

  formatTime(hours: number): string {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minutos`;
    } else if (hours < 24) {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return m > 0 ? `${h}h ${m}min` : `${h} horas`;
    } else {
      const days = Math.floor(hours / 24);
      const h = Math.round(hours % 24);
      return `${days} días ${h}h`;
    }
  }

  formatDate(date: Date | null): string {
    if (!date) return '--';
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleString('es-CO', options);
  }

  getProgressPercentage(): number {
    const timeRange = this.simulationData?.time_range || [0, 12];
    const maxTime = timeRange[1];
    return Math.min((this.nextDoseTime / maxTime) * 100, 100);
  }

  getStatusColor(): string {
    if (this.nextDoseTime < 4) {
      return 'danger'; // Muy pronto, necesita dosis ya
    } else if (this.nextDoseTime < 8) {
      return 'warning'; // Pronto
    } else {
      return 'success'; // Tiene tiempo
    }
  }

  getStatusIcon(): string {
    const color = this.getStatusColor();
    switch(color) {
      case 'danger': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return '⏰';
    }
  }

  getStatusText(): string {
    const color = this.getStatusColor();
    switch(color) {
      case 'danger': return 'Administrar dosis pronto';
      case 'warning': return 'Próxima dosis en algunas horas';
      case 'success': return 'Paciente estable';
      default: return 'Monitoreo continuo';
    }
  }
}