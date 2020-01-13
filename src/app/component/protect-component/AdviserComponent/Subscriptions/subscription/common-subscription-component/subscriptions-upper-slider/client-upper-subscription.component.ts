import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatSort} from '@angular/material';
import {DeleteSubscriptionComponent} from '../delete-subscription/delete-subscription.component';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from '../../../../../../../auth-service/authService';
import {UtilService} from 'src/app/services/util.service';
import {MatTableDataSource} from '@angular/material/table';
// import { element } from 'protractor';
export interface PeriodicElement {
  service: string;
  amt: string;
  type: string;
  subs: string;
  status: string;
  date: string;
  bdate: string;
  ndate: string;
  mode: string;
}
@Component({
  selector: 'app-client-upper-subscription',
  templateUrl: './client-upper-subscription.component.html',
  styleUrls: ['./client-upper-subscription.component.scss']
})
export class ClientUpperSubscriptionComponent implements OnInit {
  // data: any;
  isLoading = false;
  // clientData: any = [];
  // data: Array<any> = [{}, {}, {}];
  // sub = new MatTableDataSource(this.data);
  noData: string;
  // planName: any;
  // subcr: any[];
  // newArray: any[];
  clientData;
  advisorId;
  subscriptionData: Array<any> = [{subscriptions: [{}, {}, {}], planName: ''}];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(public subInjectService: SubscriptionInject, private eventService: EventService,
              public dialog: MatDialog, public subscription: SubscriptionService) {
  }
  ELEMENT_DATA;
  // dataSource: any;
  displayedColumns: string[] = ['service', 'amt', 'type', 'subs', 'status', 'date', 'bdate', 'ndate', 'mode', 'icons'];
  @Input() set upperData(data) {
    console.log(data);
    this.advisorId = AuthService.getAdvisorId();
    this.clientData = data;
    this.getSummaryDataClient();
  }
  ngOnInit() {
  }
  openPlanSlider(value, state, data) {
    if (this.isLoading) {
      return;
    }
    if (data) {
      if (value == 'billerSettings' || value == 'changePayee' || value == null) {
      } else if (data.subscriptionPricing.feeTypeId == 1) {
        value = 'createSubFixed';
        data.subFlag = 'createSubFixed';
      } else {
        value = 'createSubVariable';
        data.subFlag = 'createSubVariable';
      }
      data.clientId = this.clientData.id;
      data.isCreateSub = false;
      data.isSaveBtn = false;
    }
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          this.ngOnInit();
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.subInjectService.pushUpperData(data)
  }
  getSummaryDataClient() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientData.id,
      flag: 4,
      dateType: 0,
      limit: -1,
      offset: 0,
      order: 0,
    };
    this.subscriptionData = [{subscriptions: [{}, {}, {}], planName: ''}];
    this.subscription.getSubSummary(obj).subscribe(
      data => this.getSubSummaryRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.subscriptionData = [];
        this.isLoading = false;
      }
    );
  }
  Open(state, data) {
    let feeMode;
    data.isCreateSub = true;
    (data.subscriptionPricing.feeTypeId == 1) ? feeMode = 'fixedModifyFees' : feeMode = 'variableModifyFees';
    const fragmentData = {
      flag: feeMode,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          this.ngOnInit();
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  getSubSummaryRes(data) {
    this.isLoading = false;
    // console.log(data, data[0].clientName, 'hi client');
    this.subscriptionData = [];
    const planWiseMap = {};
    if (data == undefined) {
    } else if (data.length > 0) {
      for (const d of data) {
        if (d.subscriptionPricing.feeTypeId == 1) {
          d.serviceTypeName = 'FIXED';
        } else {
          d.serviceTypeName = 'VARIABLE';
        }
        let singlePlanWiseArray: Array<any> = planWiseMap[d.planName];
        if (!singlePlanWiseArray) {
          singlePlanWiseArray = [];
          this.subscriptionData.push({planName: d.planName, subscriptions: singlePlanWiseArray});
          planWiseMap[d.planName] = singlePlanWiseArray;
        }
        singlePlanWiseArray.push(d);
      }
      // this.clientData = data;
      /* this.subscriptionData = _.map(_.groupBy(data, (n) => {
         return n.planName;
       }));
       this.subscriptionData.forEach(element => {
         element.forEach(n => {
           element.plan = (n.planName);
         });
       });*/
    } else {
    }
    console.log('client Subscription planWiseMap **********', planWiseMap);
    console.log('client Subscription getSubSummaryRes **********', this.subscriptionData);
  }
  checkAndGenerateTableSource(dataArray) {
    // console.log('checkAndGenerateTableSource dataArray : ', dataArray);
    if (dataArray) {
      if (dataArray instanceof MatTableDataSource) {
        return dataArray;
      } else {
        const dataArraySource = new MatTableDataSource(dataArray);
        dataArraySource.sort = this.sort;
        return dataArray;
      }
    } else {
      return null;
    }
  }
  deleteModal(value, subData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        const obj = {
          advisorId: this.advisorId,
          id: subData.id
        };
        this.subscription.deleteSubscriptionData(obj).subscribe(
          data => {
            this.deletedData(data);
            dialogRef.close();
            this.getSummaryDataClient();
          }
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  delete(data, value) {
    const Fragmentdata = {
      flag: data,
      subData: value
    };
    if (data == 'cancelSubscription') {
      const dialogRef = this.dialog.open(DeleteSubscriptionComponent, {
        width: '50%',
        // height:'40%',
        data: Fragmentdata,
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }
  deletedData(data) {
    if (data == true) {
      this.eventService.openSnackBar('Deleted successfully!', 'dismiss');
    }
  }
}