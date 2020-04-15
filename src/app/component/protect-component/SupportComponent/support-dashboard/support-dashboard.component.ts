import { AddLifeInsuranceMasterComponent } from './add-life-insurance-master/add-life-insurance-master.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddStockMasterComponent } from './add-stock-master/add-stock-master.component';
import { EventService } from './../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { SupportUpperComponent } from './support-upper/support-upper.component';
import { UtilService } from 'src/app/services/util.service';
import { SupportService } from '../support.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.scss']
})
export class SupportDashboardComponent implements OnInit {
  serviceStatusData: any;
  dailyData: any;
  highcharts = Highcharts;
  chartOptions = {
    title: {
      text: 'Cams'
    },
    chart: {
      type: 'column'
    },
    chardata: {
      table: 'datatable'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr',],
      crosshair: true
    },
    yAxis:
    {
      // allowDecimals: false,
      // title: {
      //   text: 'Units'
      // }
    },
    tooltip: {
      headerFormat: '<span style = "font-size:10px"></span><table>',
      pointFormat: '<tr><td style = "color:{series.color};padding:0"> </td>' +
        '<td style = "padding:0"><b>{point.y:.1f} mm</b></td></tr>', footerFormat: '</table>', shared: true, useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
        
      }
    },
    series: [{
      data: [49.9, 71.5, 106.4, 129.2,],
      color: '#4790ff',
      name: 'This week',
    },
    {
      data: [83.6, 78.8, 98.5, 93.4],
      color: '#49b875',
      name: 'Last week',
    }]
  }
  historicalFileData: any;
  historicalFileValue: string;
  ifaCountData: any;
  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private supportService: SupportService
  ) { }

  ngOnInit() {
    // this.highcharts.chart('container',
    //   {
    //     data: {
    //       table: 'datatable'
    //     },
    //     chart: {
    //       type: 'column'
    //     },
    //     title: {
    //       text: 'Data extracted from a HTML table in the page'
    //     },
    //     yAxis: {
    //       allowDecimals: false,
    //       title: {
    //         text: 'Units'
    //       }
    //     },
    //     credits: {
    //       enabled: false
    //     },
    //     tooltip: {
    //       formatter: function () {
    //         return '<b>' + this.series.name + '</b><br/>' +
    //           this.point.y + ' ' + this.point.name.toLowerCase();
    //       }
    //     }
    //   })
    this.historicalFileValue = '0'
    this.getDailyServicesStatusReport();
    this.getDailyFiles();
    this.getIfaMatricData();
    this.filterHistoricalFileData({ value: this.historicalFileValue });
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

}
