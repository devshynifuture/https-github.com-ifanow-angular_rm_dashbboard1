import { AddKvpComponent } from './../common-component/add-kvp/add-kvp.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { DetailedKvpComponent } from './detailed-kvp/detailed-kvp.component';

@Component({
  selector: 'app-kvp-scheme',
  templateUrl: './kvp-scheme.component.html',
  styleUrls: ['./kvp-scheme.component.scss']
})
export class KvpSchemeComponent implements OnInit {
  clientId: number;
  advisorId: any;
  noData: string;
  isLoading: boolean = true;
  kvpData: any;
  sumOfCurrentValue: number;
  sumOfAmountInvested: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) { }
  displayedColumns18 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'desc', 'status', 'icons'];
  datasource;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getKvpSchemedata()
  }
  getKvpSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemeKVPData(obj).subscribe(
      data => this.getKvpSchemedataResponse(data)
    )
  }
  getKvpSchemedataResponse(data) {
    console.log(data);
    this.isLoading = false;
    if (data.KVPList.length != 0) {
      this.datasource = new MatTableDataSource(data.KVPList);
      this.datasource.sort = this.sort;
      this.sumOfCurrentValue = data.SumOfCurrentValue;
      this.sumOfAmountInvested = data.SumOfAmountInvested;
      this.kvpData = data;
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
        this.cusService.deleteKVP(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("KVP is deleted", "dismiss")
            dialogRef.close();
            this.getKvpSchemedata()
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
  openAddKVP(data,flag) {
    const fragmentData = {
      flag: 'addKVP',
      data,
      id: 1,
      state: 'open',
      componentName:(flag=="detailedKvp")?DetailedKvpComponent:AddKvpComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getKvpSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
