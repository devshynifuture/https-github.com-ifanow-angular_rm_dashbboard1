import { AddScssComponent } from './../common-component/add-scss/add-scss.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MAT_DATE_FORMATS, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from 'src/app/Data-service/event.service';
import { DetailedScssComponent } from './detailed-scss/detailed-scss.component';

@Component({
  selector: 'app-scss-scheme',
  templateUrl: './scss-scheme.component.html',
  styleUrls: ['./scss-scheme.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class ScssSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading: boolean = true;
  scssData: any;
  sumOfQuarterlyPayout: number;
  sumOfTotalAmountReceived: number;
  sumOfAmountInvested: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) { }
  displayedColumns19 = ['no', 'owner', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getScssSchemedata()
  }
  getScssSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      requiredDate: ''
    }
    this.cusService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data => this.getKvpSchemedataResponse(data)
    )
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
        this.cusService.deleteSCSS(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("SCSS is deleted", "dismiss")
            dialogRef.close();
            this.getScssSchemedata();
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
  getKvpSchemedataResponse(data: any) {
    console.log(data);
    this.isLoading = false;
    if (data.scssList.length != 0) {
      this.datasource = new MatTableDataSource(data.scssList);
      this.datasource.sort = this.sort;
      this.sumOfAmountInvested = data.sumOfAmountInvested;
      this.sumOfTotalAmountReceived = data.sumOfTotalAmountReceived;
      this.sumOfQuarterlyPayout = data.sumOfQuarterlyPayout;
      this.scssData = data;
    } else {
      this.noData = "No Scheme Found";
    }
  }
  openAddSCSS(data,flag) {
    const fragmentData = {
      flag: 'addSCSS',
      data,
      id: 1,
      state: 'open',
      componentName:(flag=="detailedScss")?DetailedScssComponent:AddScssComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getScssSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
