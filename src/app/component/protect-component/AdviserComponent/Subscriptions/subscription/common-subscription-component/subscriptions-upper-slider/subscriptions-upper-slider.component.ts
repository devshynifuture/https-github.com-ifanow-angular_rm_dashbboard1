import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {DeleteSubscriptionComponent} from '../delete-subscription/delete-subscription.component';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from "../../../../../../../auth-service/authService";

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

// const ELEMENT_DATA: PeriodicElement[] = [
//   {service: "Financial Planning", amt: "Rs.1,00,000/Quarter", type: "FIXED", subs: 'SUB-0001',status:"LIVE",date:"25/08/2019",bdate:"25/08/2019",ndate:"25/08/2019",mode:"Cheque"},
//   {service: "Investment management - AUM Linked fee", amt: "View details", type: "VARIABLE", subs: '-',status:"FUTURE",date:"25/08/2019",bdate:"-",ndate:"25/08/2019",mode:"Auto debit"},
//   {service: "Investment management - AUM Linked fee", amt: "View details", type: "VARIABLE", subs: '-',status:"NOT STARTED",date:"START",bdate:"-",ndate:"25/08/2019",mode:"NEFT/RTGS"},

// ];
@Component({

  selector: 'app-subscriptions-upper-slider',
  templateUrl: './subscriptions-upper-slider.component.html',
  styleUrls: ['./subscriptions-upper-slider.component.scss']
})
export class SubscriptionsUpperSliderComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, public dialog: MatDialog, public subscription: SubscriptionService) {
  }

  ELEMENT_DATA;
  dataSource;

  displayedColumns: string[] = ['service', 'amt', 'type', 'subs', 'status', 'date', 'bdate', 'ndate', 'mode', 'icons'];

  @Input() upperData;
  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getSummaryDataClient();
    console.log(this.upperData);
  }

  openPlanSlider(value, state, data) {
    this.eventService.sliderData(value);
    /*TODO Removed state param and passed value*/
    this.subInjectService.rightSliderData(state);
    this.subInjectService.addSingleProfile(data);

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
      data => this.getSubSummaryRes(data)
    );
  }

  getSubSummaryRes(data) {
    console.log(data);
    this.ELEMENT_DATA = data;
    this.ELEMENT_DATA.forEach(ele => {
      ele.clientId = this.upperData.id
      ele.feeMode = (ele.feeMode == 1) ? 'FIXED' : 'VARIABLE';
      ele.startsOn = (ele.status == 1) ? 'START' : ele.startsOn;
      ele.status = (ele.status == 1) ? 'NOT STARTED' : (ele.status == 2) ? 'LIVE' : (ele.status == 3) ? 'FUTURE' : 'CANCELLED';
    });
    this.dataSource = this.ELEMENT_DATA;
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  delete(data) {
    const Fragmentdata = {
      Flag: data,
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

}
