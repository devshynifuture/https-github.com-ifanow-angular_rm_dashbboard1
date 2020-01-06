import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort } from '@angular/material';
import { DeleteSubscriptionComponent } from '../delete-subscription/delete-subscription.component';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
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
  //data: any;
  isLoading = false;
  clientData: any = [];
  data: Array<any> = [{}, {}, {}];
  dataSource : any;
  noData: string;
  planName: any;
  subcr: any[];
  newArray: any[];

  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, public dialog: MatDialog, public subscription: SubscriptionService) {
  }
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ELEMENT_DATA;
  //dataSource: any;


  displayedColumns: string[] = ['service', 'amt', 'type', 'subs', 'status', 'date', 'bdate', 'ndate', 'mode', 'icons'];

  @Input() set upperData(data) {
    console.log(data)
    this.advisorId = AuthService.getAdvisorId();
    this.clientSubscriptionData = data;
    this.getSummaryDataClient();
    this.isLoading = true;
  };
  clientSubscriptionData;
  advisorId;
  ngOnInit() {
  }

  openPlanSlider(value, state, data) {
    if (data) {
      if (value == 'billerSettings' || value == 'changePayee' || value == null) {

      } else if (data.subscriptionPricing.feeTypeId == 1) {
        value = 'createSubFixed';
        data.subFlag = 'createSubFixed';
      } else {
        value = 'createSubVariable';
        data.subFlag = 'createSubVariable';
      }
      data.clientId = this.clientSubscriptionData.id;
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
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          this.getSummaryDataClient();
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.subInjectService.pushUpperData(data)
  }

  getSummaryDataClient() {
    const obj = {
      // 'id':2735, //pass here advisor id for Invoice advisor
      // 'module':1,
      // advisorId: 12345,
      advisorId: this.advisorId,
      clientId: this.clientSubscriptionData.id,
      flag: 4,
      dateType: 0,
      limit: 10,
      offset: 0,
      order: 0,
    };

    this.subscription.getSubSummary(obj).subscribe(
      data => this.getSubSummaryRes(data),
      (error) => {
        this.eventService.openSnackBar('Somthing went worng!', 'dismiss');
        this.dataSource.data = [];
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
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getSubSummaryRes(data) {
    this.isLoading = false;
    console.log(data, "hi client");
    // this.dataSource = data;
    if (data == undefined) {
      this.clientData.length == 0;
      this.dataSource = undefined;
    } else {

      for (let d of data) {
        if (d.subscriptionPricing.feeTypeId == 1) {
          d['feeTypeId'] = "FIXED"
        }
        else {
          d['feeTypeId'] = "VARIABLE"
        }

      }
      this.clientData = data;
      this.subcr = []
      this.newArray = []
      this.subcr = _.map(_.groupBy(this.clientData, function (n) {
        return n.planName
      }));
      this.subcr.forEach(element => {
        element.forEach(n => {
          element.plan = (n.planName);
        });
      });
      console.log('**********',this.subcr)
      this.dataSource = new MatTableDataSource(data);

      this.dataSource.sort = this.sort;
      console.log('getSummary response', this.dataSource)
    }


  }


  deleteModal(value, subData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete ?',
      body2: 'This cannot be undone',
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
