import { AddSsyComponent } from './../common-component/add-ssy/add-ssy.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { DetailedSsyComponent } from './detailed-ssy/detailed-ssy.component';

@Component({
  selector: 'app-ssy-scheme',
  templateUrl: './ssy-scheme.component.html',
  styleUrls: ['./ssy-scheme.component.scss']
})
export class SsySchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading: boolean = true;
  ssyData: any;
  sumOfCurrentValue: number;
  sumOfAmountInvested: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private eventService: EventService) { }
  displayedColumns16 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();;
    this.getSsySchemedata()
  }
  getSsySchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemeSSYData(obj).subscribe(
      data => this.getSsySchemedataResponse(data),
      err => this.eventService.openSnackBar(err)
    )
  }
  getSsySchemedataResponse(data) {
    console.log(data);

    this.isLoading = false;
    if (data.SSYList.length != 0) {
      this.datasource = new MatTableDataSource(data.SSYList);
      this.datasource.sort = this.sort;
      this.sumOfCurrentValue = data.SumOfCurrentValue;
      this.sumOfAmountInvested = data.SumOfAmountInvested;
      this.ssyData = data;
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
        this.cusService.deleteSSY(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("SSY is deleted", "dismiss")
            dialogRef.close();
            this.getSsySchemedata();
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
  addOpenSSY(data,flag) {
    const fragmentData = {
      flag: 'addSyss',
      data,
      id: 1,
      state:(flag=="detailedSsy")?'open35':'open',
      componentName:(flag=="detailedSsy")?DetailedSsyComponent:AddSsyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getSsySchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}