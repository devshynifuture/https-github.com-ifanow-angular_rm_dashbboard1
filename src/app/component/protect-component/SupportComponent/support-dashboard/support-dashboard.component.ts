import { AddLifeInsuranceMasterComponent } from './add-life-insurance-master/add-life-insurance-master.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddStockMasterComponent } from './add-stock-master/add-stock-master.component';
import { EventService } from './../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { SupportUpperComponent } from './support-upper/support-upper.component';
import { UtilService } from 'src/app/services/util.service';
import { SupportService } from '../support.service';
import * as Highcharts from 'highcharts';
import { SeriesColumnOptions } from 'highcharts';

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.scss']
})
export class SupportDashboardComponent implements OnInit {
  serviceStatusData: any;
  dailyData: any;
  highcharts = Highcharts;
  historicalFileData: any;
  historicalFileValue: string;
  ifaCountData: any;
  previousWeek: any;
  currentWeek: any;
  previousWeekCams: any;
  previousWeekKarvy: any;
  currentWeekCams: any;
  previousWeekFrankline: any;
  currentWeekKarvy: any;
  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    public utilsService: UtilService,
  ) { }

  ngOnInit() {
    // this.flowCash('')
    //this.flowCash2('')
    //this.flowCash3('')
    this.utilsService.loader(0);
    this.historicalFileValue = '0'
    this.getDailyServicesStatusReport();
    this.getDailyFiles();
    this.getIfaMatricData();
    this.filterHistoricalFileData({ value: this.historicalFileValue });
  }
  flowCash(previous,current,id) {
    var chart1 = new Highcharts.Chart(id, {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        crosshair: true,
      },
      yAxis:
      {
      },
      tooltip: {
        headerFormat: '<span style = "font-size:10px"></span><table>',
        pointFormat: '<tr><td style = "color:{series.color};padding:0"> </td>' +
          '<td style = "padding:0"><b>{point.y:.1f} files</b></td></tr>', footerFormat: '</table>', shared: true, useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        data: [current],
        color: '#4790ff',
        name: 'This week',
        pointWidth: 12
      } as SeriesColumnOptions, {
        data: [previous],
        color: '#49b875',
        name: 'Last week',
        pointWidth: 12
      } as SeriesColumnOptions]
    });
  }
  getDailyServicesStatusReport() {
    let obj = {};
    this.supportService.getDailyServicesStatusReport(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.serviceStatusData = data.service_status;
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getDailyFiles() {
    let obj = {};
    this.supportService.getDailyFiles(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.dailyData = data;
          console.log('getDailyFiles', this.dailyData)
          this.previousWeekCams = []
          this.currentWeekCams = []
          this.previousWeekKarvy = []
          this.currentWeekKarvy = []
          this.previousWeekFrankline = []
          this.dailyData.previousWeek[1].forEach(element => {
            this.previousWeekCams.push(element.fileCount)
          });
          this.dailyData.currentWeek[1].forEach(element => {
            this.currentWeekCams.push(element.fileCount)
          });
          this.dailyData.previousWeek[2].forEach(element => {
            this.previousWeekKarvy.push(element.fileCount)
          });
          this.dailyData.currentWeek[2].forEach(element => {
            this.currentWeekKarvy.push(element.fileCount)
          });
          this.dailyData.previousWeek[3].forEach(element => {
            this.previousWeekFrankline.push(element.fileCount)
          });
          console.log(this.previousWeekCams)
          console.log(this.currentWeekCams)
          console.log(this.previousWeekKarvy)
          console.log(this.currentWeekKarvy)
          console.log(this.previousWeekFrankline)
          //  this.currentWeekFrankline = this.dailyData.currentWeek[0]
          this.flowCash(this.previousWeekCams,this.currentWeekCams,'flowCash')
          this.flowCash(this.previousWeekKarvy,this.currentWeekKarvy,'flowCash2')
          this.flowCash(this.previousWeekFrankline,'','flowCash3')
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  filterHistoricalFileData(data) {
    let obj = { filterId: parseInt(data.value) };
    this.supportService.getHistoricFilesReport(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.historicalFileData = data;
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getIfaMatricData() {
    let obj = {};
    this.supportService.getIfaMatricData(obj).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.ifaCountData = data;
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  openAddStockMaster(data) {
    const fragmentData = {
      flag: 'openAddStockMaster',
      id: 1,
      data,
      componentName: AddStockMasterComponent,
      state: 'open35'
    }

    const subscription = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          subscription.unsubscribe();
        }
      }
    );
  }

  openAddLifeInsuranceMaster(data) {
    const fragmentData = {
      flag: 'openAddLifeInsuranceMaster',
      id: 1,
      data,
      componentName: AddLifeInsuranceMasterComponent,
      state: 'open35'
    }

    const subscription = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          subscription.unsubscribe();
        }
      }
    );
  }

  openUpperSlider(data) {
    const fragmentData = {
      flag: 'openUpper',
      id: 1,
      data,
      direction: 'top',
      componentName: SupportUpperComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          subscription.unsubscribe();
        }
      }
    );
  }

  getFilesData(){

  }

}
