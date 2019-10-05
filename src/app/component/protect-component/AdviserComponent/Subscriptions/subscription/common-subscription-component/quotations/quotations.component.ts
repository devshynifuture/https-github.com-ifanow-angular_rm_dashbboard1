import {Component, OnInit, Input} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';


import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { SubscriptionPopupComponent } from '../subscription-popup/subscription-popup.component';
import { SubscriptionService } from '../../../subscription.service';
import { ConsentTandCComponent } from '../consent-tand-c/consent-tand-c.component';
export interface PeriodicElement {
  document: string;
  plan: string;
  date: string;
  sdate: string;
  cdate: string;
  status:string;
 }


@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss']
})
export class QuotationsComponent implements OnInit {

  constructor(public subInjectService:SubscriptionInject, private eventService:EventService, public dialog: MatDialog, private subAService:SubscriptionService) {
    this.subInjectService.closeRightSlider.subscribe(
      data => this.getQuotationDesignData(data)
    )
  }
  quotationDesignEmail;
  quotationDesign;
  ngOnInit() {
   this.quotationDesign='true';
   console.log("quotation")
   this.getQuotationsList();
   console.log('clientData',this.clientData)
  }
  @Input() clientData;
  displayedColumns: string[] = ['checkbox','document','plan', 'date', 'sdate','cdate','status','icons'];
  dataSource;
  getQuotationsList()
  {
    let obj={
      'clientId':2970
    }
    this.subAService.getSubscriptionClientsQuotations(obj).subscribe(
      data =>this.getQuotationsListResponse(data)
    )
  }
  getQuotationsListResponse(data){
    console.log("dsfgasdfsdf",data);
    this.dataSource=data
  }
  openQuotationsESign(value, state) {
    this.subInjectService.rightSliderData(state)
    this.eventService.sliderData(value)
  }

  getQuotationDesignData(data) {
    this.quotationDesign = data;
  }

  changeDisplay(value) {
    this.quotationDesign = value;
    this.quotationDesignEmail=this.quotationDesign;
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
    }
    console.log(dialogData+"11111111111111");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,


    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  openPopup(data) {
    let Fragmentdata = {
      Flag: data,
    }
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      width: '70%',
      height: '100%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  OpenConsent(data) {
    let Fragmentdata = {
      Flag: data,
    }
    const dialogRef = this.dialog.open(ConsentTandCComponent, {
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  closeDiv()
  {
    this.quotationDesign='true';
  }
  display(data)
  {
    console.log(data)
    this.ngOnInit()
  }
}
