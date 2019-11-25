import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-po-rd-scheme',
  templateUrl: './po-rd-scheme.component.html',
  styleUrls: ['./po-rd-scheme.component.scss']
})
export class PoRdSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading: boolean = true;

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) { }
  displayedColumns21 = ['no', 'owner', 'cvalue', 'rate', 'deposit', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = 2978;
    this.getPoRdSchemedata();
  }
  getPoRdSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    }
    this.cusService.getSmallSavingSchemePORDData(obj).subscribe(
      data => this.getPoRdSchemedataResponse(data)
    )
  }
  getPoRdSchemedataResponse(data) {
    this.datasource = data.postOfficeRDList
    console.log(data)
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
        this.cusService.deletePORD(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("PORD is deleted", "dismiss")
            dialogRef.close();
            this.getPoRdSchemedata();
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
  addPORD(value, data) {
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
          this.getPoRdSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
