import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatSliderChange } from '@angular/material';
import { HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { GestureConfig } from "@angular/material/core";
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-change-payee',
  templateUrl: './change-payee.component.html',
  styleUrls: ['./change-payee.component.scss'],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
  ]
})
export class ChangePayeeComponent implements OnInit {
  payeeDataRes: any;
  noDataMessage: string;

  @Input() set upperData(data) {
    if (data == undefined) {
      return;
    } else {
      this.getPayeeData(data);
    }
  }

  @Input()
  set data(payeeData) {
    if (payeeData == undefined) {
      return;
    } else if (payeeData.length > 0) {
      if (payeeData.length == 1) {
        payeeData[0].share = 100
        payeeData[0].selected = 1
        this.payeeDataRes = payeeData;
      }
      else {
        this.payeeDataRes = payeeData;
      }
      return;
    } else {
      this._payeeData = payeeData;
      console.log('input payeeData : ', payeeData);
      this.getPayeeData(payeeData)
    }
  }

  get payeeData() {
    return this._payeeData;
  }

  constructor( public utils: UtilService,public subInjectService: SubscriptionInject, public subService: SubscriptionService, public eventService: EventService) {

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

  totalValue = 0;

  ngOnInit() {
    console.log('change payee upperData', this.upperData);
  }

  Close(state) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  getPayeeData(data) {
    this.getRowData = data;
    this.dataObj = {
      clientId: this.getRowData.clientId,
      subId: this.getRowData.id
    };
    this.subService.getPayeerProfile(this.dataObj).subscribe(
      responseData => {
        console.log('getPayeeProfile responseData: ', responseData);
        if (responseData) {
        } else {
          this.noDataMessage = 'No payee profile found.';
        }
        this.getPayeeProfileRes(responseData);
      }
      , error => {
        console.log('getPayeerProfile error: ', error);
      });

  }

  getPayeeProfileRes(data) {
    console.log('getPayeeProfileRes data', data);
    this.payeeDataRes = data;

  }

  openAddPayee() {
    const obj = {
      data: 'Add',
      flag: false
    };
    this.payeeFlag.emit(obj);
  }

  onInputChange(event: MatSliderChange, singlePlan) {
    console.log('This is emitted as the thumb slides');
    console.log(event.value);
    this.dataMatSlider = event.value;
  }

  saveChangePayeeSetting() {
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
    console.log('obj ====', obj);
    this.subService.changePayeeSetting(obj).subscribe(
      data => this.changePayeeSettingRes(data)
    );
  }

  changePayeeSettingRes(data) {
    console.log('changePayeeSettingRes', data);
    if (data == 1) {
      this.eventService.openSnackBar('Payee updated successfully', 'OK');
      this.Close('close');
    }
  }

  selectedPayee(data, singlePlan) {
    console.log(data);
    if (this.clickedOnMatSlider) {
      this.clickedOnMatSlider = false;
      return;
    }
    (data == 1) ? singlePlan.selected = 0 : singlePlan.selected = 1;
    this.calculateMaxValue(this.payeeDataRes);
  }

  matSliderOnChange(data, singlePlan, value) {
    console.log('matSliderOnChange', data, value);
    this.clickedOnMatSlider = true;
    if (data == 1) {
      singlePlan.selected = 0;
    } else {
      singlePlan.selected = 1;
    }
    this.calculateMaxValue(this.payeeDataRes);
  }

  calculateMaxValue(data) {
    this.totalValue = 0;
    data.forEach(singlePayee => {
      if (singlePayee.selected == 1) {
        const tempValue = this.totalValue + singlePayee.share;
        console.log('calculateMaxValue tempValue: ', tempValue);
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
