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
import {Component, Input, Output, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SubscriptionInject} from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { UtilService } from 'src/app/services/util.service';

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

  constructor(public subscription:SubscriptionService,public subInjectService: SubscriptionInject , public eventService:EventService ,public dialog:MatDialog) {
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

  config: Object = {
    charCounterCount: false
  };

  ngOnInit() {
    this.showActivityLog = false;
    console.log('CommonFroalaComponent ngOnInit screenType: ', this.screenType);
    console.log(this.changeFooter)
  }
  getcommanFroalaData(data)
  {
    this.storeData=data;
  }
  Close(value) {
    // if (this.showActivityLog == true) {
    //   this.showActivityLog = false;
    // } else {
    //   this.subInjectService.rightSideData(value);
    // }
    this.subInjectService.changeUpperRightSliderState({value:'close'})
    this.subInjectService.changeUpperRightSliderState({value:'close'})
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
  Open(value,state,data)
  {
    this.eventService.sidebarData(value)
    this.subInjectService.rightSideData(state);    
    this.subInjectService.addSingleProfile(data);
  }
  saveData(data)
  {
    console.log(data);
    this.storeData.documentText=data;
  }
  save(){
    console.log("here is saved data",this.storeData);
    if(this.changeFooter=='emailQuotation'){
      this.updateDataQuot(this.storeData);
    }else{
      this.updateData(this.storeData);
    }    this.Close('close');
  }
  updateDataQuot(data) {
    const obj = {
      id: data.id, // pass here advisor id for Invoice advisor
      docText: data.documentText,
      quotation:true
    };
    // this.subscription.updateQuotationData(obj).subscribe(
    //   data => this.getResponseData(data)
    // );

    this.subscription.updateDocumentData(obj).subscribe(
      data => this.getResponseData(data)
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
      data => this.getResponseData(data)
    );
  }
  getResponseData(data){
    console.log(data);
  }
  deleteModal(value)
  {
    let dialogData = {
      data:value,
      header: 'DELETE',
      body:'Are you sure you want to delete the document?',
      body2:'This cannot be undone',
      btnYes:'CANCEL',
      btnNo:'DELETE'
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
       width: '400px',
       data: dialogData,
       autoFocus:false,

    });
  
    dialogRef.afterClosed().subscribe(result => {
  
    });
  
  }
  // openSendEmail() {
  //   // const data = {
  //   //   advisorId: this.advisorId,
  //   //   clientData: this._clientData,
  //   //   templateType: 2, //2 is for quotation
  //   //   documentList: []
  //   // };
  //   // this.dataSource.forEach(singleElement => {
  //   //   if (singleElement.selected) {
  //   //     data.documentList.push(singleElement);
  //   //   }
  //   // });
  //   this.OpenEmail('emailQuotationFroala');
  // }
  openSendEmail(value,state,data) {
    const fragmentData = {
      Flag: value,
      data:data,
      id: 1,
      state: state
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', );
          rightSideDataSub.unsubscribe();
        }
      }
      
    );
  }
}
