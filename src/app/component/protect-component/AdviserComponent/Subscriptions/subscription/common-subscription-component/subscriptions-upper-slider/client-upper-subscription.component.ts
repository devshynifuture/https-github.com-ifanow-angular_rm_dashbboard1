import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort } from '@angular/material';
import { DeleteSubscriptionComponent } from '../delete-subscription/delete-subscription.component';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material/table';


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
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  noData: string;

  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, public dialog: MatDialog, public subscription: SubscriptionService) {
  }
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ELEMENT_DATA;
  //dataSource: any;


  displayedColumns: string[] = ['service', 'amt', 'type', 'subs', 'status', 'date', 'bdate', 'ndate', 'mode', 'icons'];

  @Input() upperData;
  advisorId;

  ngOnInit() {
    this.isLoading = true;
    // this.dataSource = [{}, {}, {}];
    this.advisorId = AuthService.getAdvisorId();
    this.getSummaryDataClient();
    console.log(this.upperData);
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
      data.clientId = this.upperData.id;
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
          rightSideDataSub.unsubscribe();
          this.getSummaryDataClient();
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
      clientId: this.upperData.id,
      flag: 4,
      dateType: 0,
      limit: 10,
      offset: 0,
      order: 0,
    };

    this.subscription.getSubSummary(obj).subscribe(
      data => this.getSubSummaryRes(data), (error) => {
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

    if (data && data.length > 0) {
      this.data = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      // this.DataToSend = data;
    } else {
      this.data = [];
      this.dataSource.data = data;
      // console.log(data);
      this.dataSource.data = []
      this.noData = 'No Data Found';
    }

    // console.log(data);
    // this.dataSource = data;
    // (data) ? this.dataSource = data : this.dataSource = [];
    // this.dataSource = new MatTableDataSource(data);

    // this.dataSource.sort = this.sort;

  }


  deleteModal(value, subData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document GD?',
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
