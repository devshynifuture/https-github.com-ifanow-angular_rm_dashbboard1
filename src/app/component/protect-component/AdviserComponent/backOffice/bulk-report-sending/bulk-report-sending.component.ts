import { Component, OnInit } from '@angular/core';
import { SendNowReportsComponent } from './send-now-reports/send-now-reports.component';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { StatusReportComponent } from './status-report/status-report.component';
import { BackOfficeService } from '../back-office.service';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomiseSettingComponent } from './customise-setting/customise-setting.component';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-bulk-report-sending',
  templateUrl: './bulk-report-sending.component.html',
  styleUrls: ['./bulk-report-sending.component.scss']
})
export class BulkReportSendingComponent implements OnInit {
  displayedColumns: string[] = ['type', 'sendDate', 'recipients', 'emails', 'status'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  isLoading
  advisorId: any;


  constructor(
    private subInjectService: SubscriptionInject,
    private backOfficeService: BackOfficeService,
    private eventService : EventService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.isLoading = false
    this.dataSource.data = [{}, {}, {}];
    this.getlistOrder()
  }
  getlistOrder() {
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true
    console.log(this.dataSource)
    const obj = {
      advisorId: this.advisorId///5125
    };
    this.backOfficeService.getOrderList(obj).subscribe(
      data => {
        console.log('getOrderList ==', data)
        this.isLoading = false
        this.dataSource.data = data
        if(data == null){
          this.dataSource.data = []
        }
        console.log(this.dataSource)
      }
    );
  }
  refresh(flag) {
    this.getlistOrder()
  }
  openSendNow(data) {
    const fragmentData = {
      flag: 'openSendNow',
      data,
      id: 1,
      state: 'open65',
      componentName: SendNowReportsComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          this.getlistOrder()
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );

  }
  openStatusReport(data) {
    const fragmentData = {
      flag: 'openSendNow',
      data,
      id: 1,
      state: 'open65',
      componentName: StatusReportComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  openCustmiseSetting(){
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: CustomiseSettingComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }
}

export interface PeriodicElement {
  type: string;
  sendDate: string;
  recipients: string;
  emails: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { type: 'MF Overview / MF Summary / MF Capital gains - Summary', sendDate: '02/05/2020', recipients: '115', emails: '2', status: 'Sent' },
  { type: 'MF Overview / MF Summary', sendDate: '02/05/2020', recipients: '115', emails: '2', status: 'Sent' },

];