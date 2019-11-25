import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-ppf-scheme',
  templateUrl: './ppf-scheme.component.html',
  styleUrls: ['./ppf-scheme.component.scss']
})
export class PPFSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading: boolean = true;

  constructor(public dialog: MatDialog, private cusService: CustomerService, private eventService: EventService, private subInjectService: SubscriptionInject) { }
  displayedColumns = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = 2978;
    this.getPpfSchemeData();
  }
  getPpfSchemeData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemePPFData(obj).subscribe(
      data => this.getPpfSchemeDataResponse(data),
      err => this.eventService.openSnackBar("server issues")
    )

  }
  getPpfSchemeDataResponse(data) {
    console.log(data);
    this.isLoading = false;
    if (data.PPFList.length != 0) {
      this.datasource = data.PPFList;
    } else {
      this.noData = "No Scheme Found";
    }
  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deletePPF(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("PPF is deleted", "dismiss")
            dialogRef.close();
            this.getPpfSchemeData();
          },
          err => this.eventService.openSnackBar(err)
        )
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
  opnAddPPF(value, data) {
    const fragmentData = {
      Flag: value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPpfSchemeData();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
export interface PeriodicElement16 {
  no: string;
  owner: string;
  cvalue: string;
  rate: string;
  amt: string;
  number: string;
  mdate: string;
  desc: string;
  status: string;
}