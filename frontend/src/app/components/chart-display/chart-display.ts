//src/app/components/chart-display/chart-display.ts

import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-display.html',
  styleUrls: ['./chart-display.scss']
})
export class ChartDisplayComponent implements OnChanges, AfterViewInit {
  @Input() data: any;
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;

  ngAfterViewInit() {
    if (this.data) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.createChart();
    }
  }

  createChart() {
    if (!this.chartCanvas) return;

    // Destruir gráfica anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Crear gráfica
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.time.map((t: number) => t.toFixed(1)),
        datasets: [
          {
            label: 'Concentración (mg/L)',
            data: this.data.concentration,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
          },
          // ← NUEVAS LÍNEAS DE NIVELES TERAPÉUTICOS
          {
            label: 'Nivel terapéutico mínimo',
            data: this.data.time.map(() => 2),
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [5, 3],
            fill: false,
            pointRadius: 0
          },
          {
            label: 'Nivel terapéutico máximo',
            data: this.data.time.map(() => 15),
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [5, 3],
            fill: false,
            pointRadius: 0
          },
          {
            label: 'Nivel tóxico',
            data: this.data.time.map(() => 20),
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [8, 4],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Concentración vs Tiempo',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + ' mg/L';
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tiempo (horas)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              maxTicksLimit: 10
            }
          },
          y: {
            title: {
              display: true,
              text: 'Concentración (mg/L)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + ' mg/L';
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }
}