import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @ViewChild('barChart') barChart;
  @Input() labels: any;
  @Input() data: any;
  @Input() selectedDhikr: any;
  @Input() maxNumber: number;
  @Input() stepSize: number;
  @Input() autoSkip: boolean;
  bars: any;
  themeColor: any;
  constructor() { }

  ngOnInit() {
    const themeColor = localStorage.getItem('theme');
    if (themeColor) {
        this.themeColor = JSON.parse(themeColor);
    }
  }

  ionViewDidEnter() {
    this.createBarChart(this.labels, this.data, this.maxNumber, this.stepSize, this.autoSkip);
  }

  createBarChart(labels: any[], data: any[], maxNumber: number, stepSize = 1, autoSkip = true) {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',//bar
      data: {
        labels,
        datasets: [{
          label: 'Zikr',
          data,
          backgroundColor: this.themeColor,
          borderColor: 'gray',
          borderWidth: 1,
          fill: true
        }]
      },
      // options: {
      //   indexAxis: 'y',
      // }
      options: {
        scales: {
          y: {
              beginAtZero: true,
              max: maxNumber,
              min: 0,
              ticks: {
                stepSize,
                autoSkip
            }
          },
      },
      },
    });
  }

}
