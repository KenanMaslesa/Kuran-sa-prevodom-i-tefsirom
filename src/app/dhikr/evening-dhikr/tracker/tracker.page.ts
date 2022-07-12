import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { MorningEveningTrackerService } from '../../morning-evening-tracker.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { DhikrService } from '../../shared/dhikr.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  @ViewChild('barChart') barChart;
  dhikrsByMonth = [];
  bars: any;
  themeColor: any;
  currentDate = new Date();
  selectedMonth: {
    name: string;
    value: string;
  };
  showTotalSegment = true;
  showByDhikrSegment = false;
  eveningDhikr = [];
  months = [
    {
      name: 'Januar',
      value: '1',
    },
    {
      name: 'Februar',
      value: '2',
    },
    {
      name: 'Mart',
      value: '3',
    },
    {
      name: 'April',
      value: '4',
    },
    {
      name: 'Maj',
      value: '5',
    },
    {
      name: 'Juni',
      value: '6',
    },
    {
      name: 'Juli',
      value: '7',
    },
    {
      name: 'August',
      value: '8',
    },
    {
      name: 'Septembar',
      value: '9',
    },
    {
      name: 'Oktobar',
      value: '10',
    },
    {
      name: 'Novembar',
      value: '11',
    },
    {
      name: 'Decembar',
      value: '12',
    },
  ];
  constructor(
    public morningEveningTrackerService: MorningEveningTrackerService,
    private modalController: ModalController,
    private dhikrService: DhikrService
  ) {
    const currentMonthNumber = this.currentDate.getMonth() + 1;
    this.selectedMonth = {
      name: this.months[currentMonthNumber].name,
      value: currentMonthNumber.toString(),
    };
  }

  ngOnInit() {
    this.dhikrService.getEveningDhikr().subscribe(response => {
      this.eveningDhikr = response;
    });
    const themeColor = localStorage.getItem('theme');
    if (themeColor) {
      this.themeColor = JSON.parse(themeColor);
    }
  }

  ionViewDidEnter() {
    this.getEveningDhikrData();
  }

  getEveningDhikrData() {
    this.morningEveningTrackerService
      .getEveningDhikrsByMonth(this.selectedMonth.value)
      .subscribe((response) => {
        this.dhikrsByMonth = response;
        const dates = this.dhikrsByMonth.map((item) => item.date);
        const counters = this.dhikrsByMonth.map((item) => item.total);
        this.createBarChart(dates, counters);
      });
  }

  ionViewDidLeave() {
    this.bars.destroy();
  }

  createBarChart(labels: any[], data: any[]) {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Vecernji zikr',
            data,
            backgroundColor: this.themeColor,
            borderColor: 'gray',
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 14, //number of evening dhikrs
            min: 0,
            ticks: {
              stepSize: 1,
              autoSkip: false,
            },
          },
        },
      },
    });
  }

  onMonthChanged(month) {
    this.selectedMonth.value = month;
    this.bars.destroy();
    this.getEveningDhikrData();
  }

  segmentChanged(segment) {
    if (segment === 'total') {
      this.showTotalSegment = true;
      this.showByDhikrSegment = false;
    } else if (segment === 'byDhikr') {
      this.showTotalSegment = false;
      this.showByDhikrSegment = true;
    }
  }

  async presentModal(labels: any, data: any, selectedDhikr: any, maxNumber: number, stepSize: number, autoSkip: boolean) {
    const modal = await this.modalController.create({
      component: ChartComponent,
      cssClass: '',
      initialBreakpoint: 0.7,
      breakpoints: [0.5, 0.9],
      componentProps: {
        labels,
        data,
        selectedDhikr,
        maxNumber,
        stepSize,
        autoSkip
      },
    });
    return await modal.present();
  }

  getParticularDhikr(dhikr: any) {
    const obj =
      this.morningEveningTrackerService.getDhikrForTrackerByMonthAndDhikrID('eveningDhikr' ,this.selectedMonth.value, dhikr.id);
    this.presentModal(obj.labels, obj.data, dhikr, obj.recitate, (obj.recitate>10?10:1), obj.recitate>10);
  }
}
