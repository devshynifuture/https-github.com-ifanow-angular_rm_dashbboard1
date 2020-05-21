import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatSliderChange } from '@angular/material';
import { HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { GestureConfig } from "@angular/material/core";
import { UtilService } from 'src/app/services/util.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { PayeeSettingsComponent } from '../payee-settings/payee-settings.component';

@Component({
  selector: 'app-change-payee',
  templateUrl: './change-payee.component.html',
  styleUrls: ['./change-payee.component.scss'],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
  ]
})
export class ChangePayeeComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
  payeeDataRes: any=[];
  noDataMessage: string;
  @Output() subStartNextBtn = new EventEmitter();
  // @Input() set upperData(data) {
  //   if (data != undefined) {
  //     this.getPayeeData(data);
  //   }

  // }
  clientData:any;
  @Input()
  set data(payeeData) {
    if(payeeData != undefined){
      this.isLoading = true;
        this.payeeDataRes = [{},{}];
      if(payeeData.id == undefined){
        if (payeeData.length == 1) {
          payeeData[0].share = 100
          payeeData[0].selected = 1
          this.subStartNextBtn.emit(payeeData[0])
          
        }
        this.payeeDataRes = payeeData;
        this.isLoading = false;

      }
      else{
        this.isLoading = true;
        this.payeeDataRes = [{},{}];
        this.clientData = payeeData;
      }
    }
  }

  restrictAfter100(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
    }
  }

  get payeeData() {
    return this._payeeData;
  }

  constructor(public utils: UtilService, public subInjectService: SubscriptionInject, public subService: SubscriptionService, public eventService: EventService) {

  }


  // noDataMessage = 'Loading...';
  _payeeData: any;

  @Output() outputData = new EventEmitter<Object>();
  @Output() payeeFlag = new EventEmitter<Object>();
  dataSub: any;
  dataObj;
  getRowData: any;
  isSelectedPlan: any;
  arraTosend: any;
  dataMatSlider: any;
  clickedOnMatSlider = false;
  isLoading:boolean =false;
  totalValue = 0;

  ngOnInit() {
    if(this.clientData != undefined){
     this.getPayeeData(this.clientData);
     
    }
  }

  Close(flag) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close',refreshRequired:flag });
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag });
  }
  getPayeeData(data) {
    this.getRowData = data;
    this.dataObj = {
      clientId: this.getRowData.clientId,
      subId: this.getRowData.id
    };
    this.subService.getPayeerProfile(this.dataObj).subscribe(
      responseData => {
        if (responseData) {
        } else {
          this.noDataMessage = 'No payee profile found.';
        }
        this.getPayeeProfileRes(responseData);
      }
      , error => {
      });

  }

  getPayeeProfileRes(data) {
    this.isLoading = false;
    this.payeeDataRes = data;
  }

  // openAddPayee() {
  //   const obj = {
  //     data: 'Add',
  //     flag: false
  //   };
  //   this.payeeFlag.emit(obj);
  // }

  onInputChange(event: MatSliderChange, singlePlan) {
    this.dataMatSlider = event.value;
  }

  saveChangePayeeSetting() {
    if(this.totalValue!=100){
      this.eventService.openSnackBar('Total spliting ratio of selected payee should be equal to 100%', 'Dismiss')
    }
    else{
      this.barButtonOptions.active = true;
      const obj = [];
      this.payeeDataRes.forEach(element => {
        if (element.selected == 1 || element.selected == true) {
          const obj1 = {
            id: element.id,
            subscriptionId: this.getRowData.id,
            share: element.share
          };
          obj.push(obj1);
        }
      });
      this.subService.changePayeeSetting(obj).subscribe(
        data =>{
          this.barButtonOptions.active = false;
          this.changePayeeSettingRes(data);
        },
        err =>{
          this.barButtonOptions.active = false;
        }
      );
    }
  }

  changePayeeSettingRes(data) {
    if (data == 1) {
      this.eventService.openSnackBar('Payee updated successfully', 'OK');
      this.Close(true);
    }
  }

  selectedPayee(data, singlePlan) {
    if (this.clickedOnMatSlider) {
      this.clickedOnMatSlider = false;
      return;
    }
    (data == 1) ? singlePlan.selected = 0 : singlePlan.selected = 1;
    this.calculateMaxValue(this.payeeDataRes);
  }

  matSliderOnChange(data, singlePlan, value) {
    this.clickedOnMatSlider = true;
    if (data == 1) {
      singlePlan.selected = 0;
    } else {
      singlePlan.selected = 1;
    }
    this.calculateMaxValue(this.payeeDataRes);
  }

  openPayeeSettings(profileData, value, state) {
    // (profileData == "Add") ? profileData = { flag: profileData } : ''
    // profileData['clientData'] = this.upperData
    // const fragmentData = {
    //   flag: value,
    //   data: profileData,
    //   id: 1,
    //   state: 'open',
    //   componentName: PayeeSettingsComponent
    // };
    // const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
    //   sideBarData => {
    //     // this.getSettingProfileData();
    //     if (UtilService.isDialogClose(sideBarData)) {
    //       rightSideDataSub.unsubscribe();
    //     }
    //   }
    // );

    this.payeeFlag.emit(true);
  }

  calculateMaxValue(data) {
    this.totalValue = 0;
    data.forEach(singlePayee => {
      if (singlePayee.selected == 1) {
        const tempValue = this.totalValue + singlePayee.share;
        if (tempValue >= 100) {
          singlePayee.share = 100 - this.totalValue;
          this.totalValue = 100;
        } else {
          this.totalValue = tempValue;
        }
        // if (singlePayee.share == 0) {
        //   singlePayee.selected = 0;
        // }
      }
    });

    this.outputData.emit(data);
    return this.totalValue;

  }

  goBack() {

  }
}
