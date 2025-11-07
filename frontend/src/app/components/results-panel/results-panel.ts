//src/app/components/results-panel/results-panel.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-panel.html',
  styleUrls: ['./results-panel.scss']
})
export class ResultsPanelComponent {
  @Input() data: any;

  getStatus(): string {
    if (!this.data?.statistics) return 'unknown';
    
    const final = this.data.statistics.final_concentration;
    
    if (final >= 10 && final <= 20) return 'good';
    if (final < 10) return 'low';
    if (final > 150) return 'toxic';
    return 'high';
  }

  getStatusText(): string {
    const status = this.getStatus();
    
    switch(status) {
      case 'good': return '✅ En rango terapéutico';
      case 'low': return '⚠️ Nivel bajo - Considerar nueva dosis';
      case 'high': return '⚠️ Nivel alto';
      case 'toxic': return '🚨 Nivel tóxico';
      default: return 'Calculando...';
    }
  }
}