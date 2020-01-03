/*
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';

@Component({
  selector: 'app-common-froala',
  templateUrl: './common-froala.component.html',
  styleUrls: ['./common-froala.component.scss']
})
export class CommonFroalaComponent implements OnInit {
  showActivityLog: boolean;

  constructor(public subInjectService: SubscriptionInject)  { }

  ngOnInit() {
    this.showActivityLog=false;
  }
  Close(value) {
    if(this.showActivityLog==true){
      this.showActivityLog=false;
    }else{
    this.subInjectService.rightSideData(value);
    }
  }
  openFroala()
  {
    this.showActivityLog=true;
  }
  cancel()
  {
    this.showActivityLog=false;
  }
}
*/
import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {SubscriptionService} from '../../../subscription.service';
import {UtilService} from 'src/app/services/util.service';
import {EmailOnlyComponent} from '../email-only/email-only.component';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-common-froala',
  templateUrl: './common-froala.component.html',
  styleUrls: ['./common-froala.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonFroalaComponent),
      multi: true
    }
  ]
})
export class CommonFroalaComponent implements ControlValueAccessor, OnInit {
  dataSub: any;
  storeData: any;
  inputData: any;
  templateType: number;
  advisorId;

  constructor(public subscription: SubscriptionService, public subInjectService: SubscriptionInject,
              public eventService: EventService, public dialog: MatDialog) {
    this.advisorId = AuthService.getAdvisorId();
    // this.dataSub = this.subInjectService.singleProfileData.subscribe(
    //   data=>this.getcommanFroalaData(data)
    // );
  }

  @Input() screenType;
  @Input() changeFooter;
  @Input() changeEmailOnly;

  @Input()
  set data(data) {
    this.inputData = data;
    this.getcommanFroalaData(data);
  }

  get data() {
    return this.inputData;
  }

  showActivityLog: boolean;

  // End ControlValueAccesor methods.

  model: any;

  config = {
    charCounterCount: false
  };

  ngOnInit() {
    this.showActivityLog = false;
    console.log('CommonFroalaComponent ngOnInit screenType: ', this.screenType);
    console.log(this.changeFooter);
  }

  getcommanFroalaData(data) {
    this.storeData = data;
  }

  Close(data) {
    // if (this.showActivityLog == true) {
    //   this.showActivityLog = false;
    // } else {
    //   this.subInjectService.rightSideData(value);
    // }
    this.subInjectService.changeNewRightSliderState({state: 'close', data});
    this.subInjectService.changeUpperRightSliderState({state: 'close', data});

    // this.subInjectService.changeUpperRightSliderState({value:'close'})
    // this.subInjectService.changeUpperRightSliderState({value:'close'})
  }

  openFroala() {
    this.showActivityLog = true;
  }

  cancel() {
    this.showActivityLog = false;
  }

  // Begin ControlValueAccesor methods.
  onChange = (_) => {
  }
  onTouched = () => {
  }

  // Form model content changed.
  writeValue(content: any): void {
    this.model = content;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  Open(value, state, data) {
    this.eventService.sidebarData(value);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);
  }

  saveData(data) {
    console.log(data);
    this.storeData.documentText = data;
  }

  save() {
    console.log('here is saved data', this.storeData);
    if (this.storeData.quotation == true) {
      this.updateDataQuot(this.storeData);
    } else {
      this.updateData(this.storeData);
    }
    this.Close('close');
  }

  updateDataQuot(data) {
    const obj = {
      id: data.id, // pass here advisor id for Invoice advisor
      docText: data.documentText,
      quotation: true
    };
    // this.subscription.updateQuotationData(obj).subscribe(
    //   data => this.getResponseData(data)
    // );

    this.subscription.updateDocumentData(obj).subscribe(
      responseData => this.getResponseData(responseData)
    );
  }

  updateData(data) {
    const obj = {
      id: data.id, // pass here advisor id for Invoice advisor
      docText: data.documentText
    };
    // this.subscription.updateQuotationData(obj).subscribe(
    //   data => this.getResponseData(data)
    // );

    this.subscription.updateDocumentData(obj).subscribe(
      responseData => this.getResponseData(responseData)
    );
  }

  getResponseData(data) {
    console.log(data);
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

  openSendEmailQuotation() {
    if (this.storeData.quotation) {
      this.templateType = 2;
    } else {
      this.templateType = 4;
    }
    const data = {
      advisorId: this.advisorId,
      clientData: this.storeData,
      templateType: this.templateType, // 2 is for quotation
      documentList: [this.storeData]
    };
    // this.dataSource.forEach(singleElement => {
    //   if (singleElement.selected) {
    //     data.documentList.push(singleElement);
    //   }
    // });
    this.OpenEmail(data, 'email');
  }

  openSendEmail() {
    if (this.storeData.isDocument == true) {
      this.templateType = 4;
    } else {
      this.templateType = 2;
    }
    const data = {
      advisorId: this.advisorId,
      clientData: this.storeData,
      templateType: this.templateType, // 2 is for quotation
      documentList: [this.storeData],
    };
    // this.dataSource.forEach(singleElement => {
    //   if (singleElement.selected) {
    //     data.documentList.push(singleElement);
    //   }
    // });
    this.OpenEmail(data, 'email');
  }

  OpenEmail(data, value) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: EmailOnlyComponent

    };
    if (this.screenType) {
      const rightSideDataSub2 = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
        sideBarData => {
          console.log('this is sidebardata in subs subs : ', sideBarData);
          if (UtilService.isDialogClose(sideBarData)) {
            console.log('this is sidebardata in subs subs 2: ');
            rightSideDataSub2.unsubscribe();
          }
        }
      );
    } else {
      const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
        sideBarData => {
          if (UtilService.isDialogClose(sideBarData)) {
            rightSideDataSub.unsubscribe();
          }
        }
      );
    }

  }
}
