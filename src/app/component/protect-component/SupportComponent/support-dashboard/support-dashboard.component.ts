import { AuthService } from 'src/app/auth-service/authService';
import { AddLifeInsuranceMasterComponent } from './add-life-insurance-master/add-life-insurance-master.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddStockMasterComponent } from './add-stock-master/add-stock-master.component';
import { EventService } from './../../../../Data-service/event.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupportUpperComponent } from './support-upper/support-upper.component';
import { UtilService } from 'src/app/services/util.service';
import { SupportService } from '../support.service';
import * as Highcharts from 'highcharts';
import { SeriesColumnOptions } from 'highcharts';
import { ReconciliationService } from '../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-support-dashboard',
  templateUrl: './support-dashboard.component.html',
  styleUrls: ['./support-dashboard.component.scss']
})
export class SupportDashboardComponent implements OnInit, OnDestroy {
  serviceStatusData: any;
  dailyData: any;
  highcharts = Highcharts;
  historicalFileData: any;
  ifaCountData: any;
  previousWeek: any;
  currentWeek: any;
  previousWeekCams: any;
  previousWeekKarvy: any;
  currentWeekCams: any;
  previousWeekFrankline: any;
  currentWeekKarvy: any;

  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  rmName = AuthService.getUserInfo().name;

  subscription = new Subscription();
  bulkData: any[] = [{}, {}, {}];
  dropDownData: any[] = [];
  hasError: boolean = false;
  dailyFileSelected = 'option1';

  dashFG: FormGroup;
  currentWeekFrankline: any;
  njCount: any;
  prudentCount: any;
  constructor(
    private eventService: EventService,
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    public utilsService: UtilService,
    private reconsilationService: ReconciliationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.utilsService.loader(0);

    this.createFormGroup();
    this.addFormListeners();
    this.loadGlobalData();

    this.getDailyServicesStatusReport();
    this.getDailyFiles();
    this.getIfaMatricData();
    this.getMappedUnmappedCount(4);
    this.getMappedUnmappedCount(5);
  }
  getMappedUnmappedCount(flag) {
    let obj = {
      rtId: flag,
      isMapped: false

    };
    this.supportService.getMappedUnmappedCount(obj).subscribe(
      data => {
        if (data) {
          console.log('count nkj prudent', data)
          if (flag == 4) {
            this.prudentCount = data
          } else {
            this.njCount = data
          }
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  createFormGroup() {
    this.dashFG = this.fb.group({
      bulkOptRtId: '',
      historicalFileOptId: '',
    });
  }

  addFormListeners() {
    this.subscription.add(
      this.dashFG.controls.bulkOptRtId.valueChanges.subscribe(value => {
        this.loadBulkFilesData();
      })
    );
    this.subscription.add(
      this.dashFG.controls.historicalFileOptId.valueChanges.subscribe(value => {
        this.filterHistoricalFileData();
      })
    );
  }

  flowCash(previous, current, id) {
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
        data: [current[0].fileCount, current[1].fileCount, current[2].fileCount, current[3].fileCount, current[4].fileCount, current[5].fileCount, current[6].fileCount],
        color: '#4790ff',
        name: 'This week',
        pointWidth: 10
      } as SeriesColumnOptions, {
        data: [previous[0].fileCount, previous[1].fileCount, previous[2].fileCount, previous[3].fileCount, previous[4].fileCount, previous[5].fileCount, previous[6].fileCount],
        color: '#49b875',
        name: 'Last week',
        pointWidth: 10
      } as SeriesColumnOptions]
    });
  }

  getDailyServicesStatusReport() {
    let obj = {};
    this.supportService.getDailyServicesStatusReport(obj).subscribe(
      data => {
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
        if (data) {
          this.dailyData = data;
          console.log('dailyData', this.dailyData)
          this.previousWeekCams = data.previousWeek[1]
          this.currentWeekCams = data.currentWeek[1]
          this.previousWeekKarvy = data.previousWeek[2]
          this.currentWeekKarvy = data.currentWeek[2]
          this.previousWeekFrankline = data.previousWeek[3]
          this.currentWeekFrankline = data.currentWeek[3]
          if (this.dailyData.previousWeek[1]) {
            this.dailyData.previousWeek[1].forEach(element => {
              this.previousWeekCams.push(element.fileCount)
            });
          } else if (this.dailyData.currentWeek[1]) {
            this.dailyData.currentWeek[1].forEach(element => {
              this.currentWeekCams.push(element.fileCount)
            });
          }
          else if (this.dailyData.previousWeek[2]) {
            this.dailyData.previousWeek[2].forEach(element => {
              this.previousWeekKarvy.push(element.fileCount)
            });
          }
          else if (this.dailyData.currentWeek[2]) {
            this.dailyData.currentWeek[2].forEach(element => {
              this.currentWeekKarvy.push(element.fileCount)
            });
          }
          else if (this.dailyData.currentWeek[3]) {
            this.dailyData.currentWeek[3].forEach(element => {
              this.currentWeekFrankline.push(element.fileCount)
            });
          }

          console.log('previousWeekCams', this.previousWeekCams)
          console.log('previousWeekKarvy', this.previousWeekKarvy)
          //  this.currentWeekFrankline = this.dailyData.currentWeek[0]
          this.flowCash(this.previousWeekCams, this.currentWeekCams, 'flowCash')
          this.flowCash(this.previousWeekKarvy, this.currentWeekKarvy, 'flowCash2')
          this.flowCash(this.previousWeekFrankline, this.currentWeekFrankline, 'flowCash3')
        }
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }

  filterHistoricalFileData() {
    let obj = { rtId: this.dashFG.controls.historicalFileOptId.value };
    this.utilsService.loader(1);
    this.supportService.getHistoricFilesReport(obj).subscribe(
      res => {
        if (res) {
          console.log("historical file data:::", res);
          this.historicalFileData = res;
        }
        this.utilsService.loader(-1);
      }
      , err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }

  getIfaMatricData() {
    let obj = {};
    this.supportService.getIfaMatricData(obj).subscribe(
      data => {
        console.log("this is my ifa metric data::", data);
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
      state: 'open40'
    }

    const subscription = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
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
      state: 'open40'
    }

    const subscription = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
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

  loadGlobalData() {
    this.utilsService.loader(1);
    this.reconsilationService.getRTListValues({}).subscribe(res => {
      this.dropDownData = res;
      this.dashFG.controls.bulkOptRtId.setValue(this.dropDownData[0].id);
      this.dashFG.controls.historicalFileOptId.setValue(this.dropDownData[0].id);
      this.utilsService.loader(-1);
    }, err => {
      this.hasError = true;
      this.utilsService.loader(-1);
      this.eventService.openSnackBar(err, "Dismiss");
    });
  }

  loadBulkFilesData() {
    const jsonObj = {
      days: 0,
      fileTypeId: 0,
      rmId: this.rmId,
      rtId: this.dashFG.controls.bulkOptRtId.value,
      limit: 10
    }
    this.utilsService.loader(1);
    this.supportService.getBulkFilesData(jsonObj).subscribe(res => {
      this.utilsService.loader(-1);
      console.log("this is bulk file data::", res);
      this.bulkData = res;
    }, err => {
      this.utilsService.loader(-1);
      this.eventService.openSnackBar(err, "Dismiss");
    });
  }

  getRTCode(code) {
    if (code) {
      const rt = this.dropDownData.find(data => data.id == code);
      const rtCode = rt.name as string;
      return rtCode.slice(0, 2);
    } else {
      return '';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
