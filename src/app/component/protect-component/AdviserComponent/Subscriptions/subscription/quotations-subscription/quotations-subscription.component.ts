import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {SubscriptionInject} from '../../subscription-inject.service';
import {SubscriptionService} from '../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from "../../../../../../auth-service/authService";
import { UtilService } from 'src/app/services/util.service';

export interface PeriodicElement {
  name: string;
  docname: string;
  plan: string;

  cdate: string;
  sdate: string;
  clientsign: string;
  status: string;
}

@Component({
  selector: 'app-quotations-subscription',
  templateUrl: './quotations-subscription.component.html',
  styleUrls: ['./quotations-subscription.component.scss']
})
export class QuotationsSubscriptionComponent implements OnInit {

  displayedColumns: string[] = ['name', 'docname', 'plan', 'cdate', 'sdate', 'clientsign', 'status', 'icons'];
  advisorId;
  dataSource;

  constructor(public eventService: EventService, public subInjectService: SubscriptionInject,
              public dialog: MatDialog, private subService: SubscriptionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getQuotationsData();
  }

  getQuotationsData() {
    const obj = {
      // advisorId: 12345
      advisorId: this.advisorId,

    };
    this.subService.getSubscriptionQuotationData(obj).subscribe(
      data => this.getQuotationsDataResponse(data)
    );
  }

  getQuotationsDataResponse(data) {
    console.log(data);
    this.dataSource = data;
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document GD?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        console.log('11111111111111111111111111111111111111111111');
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  Open(value, state, data) {
    const fragmentData = {
      Flag: value,
      data:data,
      id: 1,
      state: state
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', );
          rightSideDataSub.unsubscribe();
        }
      }
      
    );
  }

  // Open(value)
  // {
  //   this.subInjectService.rightSideData(value);
  // }
}
