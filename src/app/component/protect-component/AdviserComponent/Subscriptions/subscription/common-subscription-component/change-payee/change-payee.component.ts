import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {SubscriptionService} from '../../../subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatSliderChange} from '@angular/material';

@Component({
  selector: 'app-change-payee',
  templateUrl: './change-payee.component.html',
  styleUrls: ['./change-payee.component.scss']
})
export class ChangePayeeComponent implements OnInit {

  @Input() set upperData(data) {
    this.getPayeeData(data);
  }


  noDataMessage = 'Loading...';
  _payeeData: any;
  @Input()
  set payeeData(payeeData) {
    this._payeeData = payeeData;
    console.log('input payeeData : ', payeeData);
    if (payeeData == undefined || payeeData.length > 0) {
    } else {
      this.noDataMessage = 'No payee profile found.';
    }
  }

  get payeeData() {
    return this._payeeData;
  }

  @Output() outputData = new EventEmitter<Object>();

  dataSub: any;
  dataObj;
  getRowData: any;
  isSelectedPlan: any;
  arraTosend: any;
  dataMatSlider: any;
  clickedOnMatSlider = false;

  constructor(public subInjectService: SubscriptionInject, public subService: SubscriptionService, public eventService: EventService) {

  }

  ngOnInit() {
    console.log('change payee upperData', this.upperData);
  }

  Close(state) {
    this.subInjectService.rightSideData(state);
    this.subInjectService.rightSliderData(state);
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
    this.payeeData = data;

  }

  onInputChange(event: MatSliderChange, singlePlan) {
    console.log('This is emitted as the thumb slides');
    console.log(event.value);
    this.dataMatSlider = event.value;
  }

  saveChangePayeeSetting() {
    const obj = [];
    this._payeeData.forEach(element => {
      if (element.selected == 1 || element.selected == true) {
        const obj1 = {
          id: element.id,
          subscriptionId: this.getRowData.id
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
    if (data == 1) {
      singlePlan.selected = 0;
    } else {
      singlePlan.selected = 1;
    }

    this.calculateMaxValue();
  }

  matSliderOnChange(data, singlePlan, value) {
    console.log('matSliderOnChange', data, value);
    this.clickedOnMatSlider = true;
    if (data == 1) {
      singlePlan.selected = 0;
    } else {
      singlePlan.selected = 1;
    }
    this.calculateMaxValue();
  }

  totalValue = 0;

  calculateMaxValue() {
    this.totalValue = 0;
    this._payeeData.forEach(singlePayee => {
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

    this.outputData.emit(this._payeeData);
    return this.totalValue;

  }
}
