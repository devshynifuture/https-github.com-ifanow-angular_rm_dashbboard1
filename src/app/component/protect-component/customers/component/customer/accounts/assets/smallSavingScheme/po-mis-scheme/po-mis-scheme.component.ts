import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-po-mis-scheme',
  templateUrl: './po-mis-scheme.component.html',
  styleUrls: ['./po-mis-scheme.component.scss']
})
export class PoMisSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  isLoading: boolean = true;
  noData: string;
  pomisData: any;
  sumOfCurrentValue: number;
  sumOfMonthlyPayout: number;
  sumOfAmountInvested: number;
  sumOfMaturityValue: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject, public util: UtilService) { }
  displayedColumns = ['no', 'owner', 'cvalue', 'mpayout', 'rate', 'amt', 'mvalue', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = 2978;
    this.getPoMisSchemedata()
  }
  getPoMisSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemePOMISData(obj).subscribe(
      data => this.getPoMisSchemedataResponse(data)
    )
  }
  getPoMisSchemedataResponse(data) {
    console.log(data);
    this.isLoading = false;
    if (data.poMisList.length != 0) {
      this.datasource = new MatTableDataSource(data.poMisList)
      this.datasource.sort = this.sort;
      this.sumOfMaturityValue = data.sumOfMaturityValue;
      this.sumOfCurrentValue = data.sumOfCurrentValue;
      this.sumOfMonthlyPayout = data.sumOfMonthlyPayout;
      this.sumOfAmountInvested = data.sumOfAmountInvested;

      this.pomisData = data;
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
        this.cusService.deletePOMIS(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("POMIS is deleted", "dismiss")
            dialogRef.close();
            this.getPoMisSchemedata();
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
  addPOMIS(value, data) {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPoMisSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
