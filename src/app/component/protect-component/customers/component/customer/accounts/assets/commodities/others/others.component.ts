import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomerService} from '../../../../customer.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {DatePipe} from '@angular/common';
import {MAT_DATE_FORMATS} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {AuthService} from 'src/app/auth-service/authService';
import {UtilService} from 'src/app/services/util.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss'], providers: [
    [DatePipe],
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],
})
export class OthersComponent implements OnInit {
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  showHide = false;
  isTypeOfCommodity = false;
  isMarketValue = false;
  others: any;
  ownerData: any;
  advisorId: any;
  clientId: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.getdataForm(this.inputData);

  }

  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }

  Close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.others.get('growthRate').setValue(event.target.value);
    }
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    this.others = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      typeOfCommodity: [(data == undefined) ? '' : (data.commodityTypeId) + '', [Validators.required]],
      marketValue: [(data == undefined) ? '' : (data.marketValue), [Validators.required]],
      purchaseValue: [(data == undefined) ? '' : (data.purchaseValue), [Validators.required]],
      interestRate: [(data == undefined) ? '' : data.interestRate, [Validators.required]],
      dateOfPurchase: [(data == undefined) ? '' : new Date(data.dateOfPurchase), [Validators.required]],
      growthRate: [(data == undefined) ? '' : data.growthRate, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.others.controls;
    this.familyMemberId = this.others.controls.familyMemberId.value;
    this.familyMemberId = this.familyMemberId[0];
  }

  getFormControl(): any {
    return this.others.controls;
  }

  saveOthers() {

    if (this.others.controls.typeOfCommodity.invalid) {
      this.isTypeOfCommodity = true;
      return;
    } else if (this.others.controls.marketValue.invalid) {
      this.isMarketValue = true;
      return;
    } else {
      const obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.others.controls.ownerName.value : this.ownerName,
        commodityTypeId: this.others.controls.typeOfCommodity.value,
        marketValue: this.others.controls.marketValue.value,
        purchaseValue: this.others.controls.purchaseValue.value,
        growthRate: this.others.controls.growthRate.value,
        dateOfPurchase: (this.others.controls.dateOfPurchase.touched)?this.datePipe.transform(this.others.controls.dateOfPurchase.value, 'yyyy-MM-dd'):this.others.controls.dateOfPurchase.value,
        description: this.others.controls.description.value,
        id: this.others.controls.id.value
      };

      if (this.others.controls.id.value == undefined) {
        delete obj.id;
        this.custumService.addOthers(obj).subscribe(
          data => this.addOthersRes(data)
        );
      } else {
        // edit call
        this.custumService.editOthers(obj).subscribe(
          data => this.editOthersRes(data)
        );
      }
    }
  }

  addOthersRes(data) {
    console.log('addrecuringDepositRes', data);
    this.subInjectService.changeNewRightSliderState({state: 'close', data});
  }

  editOthersRes(data) {
    this.subInjectService.changeNewRightSliderState({state: 'close', data});
  }

}
