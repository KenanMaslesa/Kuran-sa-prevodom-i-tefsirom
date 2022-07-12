import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TasbeehService } from '../tasbeeh.service';
import { Chart, registerables } from 'chart.js';import { ModalController } from '@ionic/angular';
import { ChartComponent } from '../../shared/components/chart/chart.component';
 Chart.register(...registerables);
@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  @ViewChild('barChart') barChart;
  dhikrsByMonth: any;
  allDhikrs: any;
  bars: any;
  themeColor: any;
  currentDate = new Date();
  selectedMonth: {
    name: string;
    value: string;
  };
  months = [
    {
      name: 'Januar',
      value: '1'
    },
    {
      name: 'Februar',
      value: '2'
    },
    {
      name: 'Mart',
      value: '3'
    },
    {
      name: 'April',
      value: '4'
    },
    {
      name: 'Maj',
      value: '5'
    },
    {
      name: 'Juni',
      value: '6'
    },
    {
      name: 'Juli',
      value: '7'
    },
    {
      name: 'August',
      value: '8'
    },
    {
      name: 'Septembar',
      value: '9'
    },
    {
      name: 'Oktobar',
      value: '10'
    },
    {
      name: 'Novembar',
      value: '11'
    },
    {
      name: 'Decembar',
      value: '12'
    }
  ];
  showTotalSegment = true;
  showByDhikrSegment = false;

  constructor(public tasbeehService: TasbeehService, public modalController: ModalController) {
    const currentMonthNumber = this.currentDate.getMonth() + 1;
    this.selectedMonth = {
      name: this.months[currentMonthNumber].name,
      value: currentMonthNumber.toString()
    };
   }

  ngOnInit() {
    this.dhikrsByMonth = this.tasbeehService.getDhikrsByMonth((this.currentDate.getMonth()+1).toString());
    this.allDhikrs = this.tasbeehService.dhikrs;

    const themeColor = localStorage.getItem('theme');
    if (themeColor) {
        this.themeColor = JSON.parse(themeColor);
    }
  }

  async presentModal(labels: any, data: any, selectedDhikr: any) {
    const modal = await this.modalController.create({
      component: ChartComponent,
      cssClass: '',
      initialBreakpoint: 0.5,
      // breakpoints: [0.5, 0.9],
      componentProps: {
        labels,
        data,
        selectedDhikr
      }
    });
    return await modal.present();
  }

  getParticularDhikr(dhikr: any){
    const obj = this.tasbeehService.getParticularDhikrByMonth(dhikr, this.selectedMonth.value);
    this.presentModal(obj.labels, obj.data, dhikr);
  }

  ionViewDidEnter() {
    this.dhikrsByMonth = this.tasbeehService.getDhikrsByMonth((this.currentDate.getMonth()+1).toString());
    this.daily();
  }

  ionViewDidLeave()	{
    this.bars.destroy();
  }

  createBarChart(labels: any[], data: any[]) {
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
              beginAtZero: true
          },
      },
      },
    });
  }

  daily(){
    const dates = this.dhikrsByMonth.map(item => item.date);
    const counters = this.dhikrsByMonth.map(item => {
      let total = 0;
      item.dhikrs.forEach(element => {
        total += element.counter;
      });
      return total;
    });
    this.createBarChart(dates, counters);
  }

  onMonthChanged(month) {
    this.selectedMonth.value = month;
    this.dhikrsByMonth = this.tasbeehService.getDhikrsByMonth(month);
    this.bars.destroy();
    this.daily();
  }

  segmentChanged(segment) {
    if(segment === 'total') {
      this.showTotalSegment = true;
      this.showByDhikrSegment = false;
    }
    else if(segment === 'byDhikr') {
      this.showTotalSegment = false;
      this.showByDhikrSegment = true;
    }
  }
}
