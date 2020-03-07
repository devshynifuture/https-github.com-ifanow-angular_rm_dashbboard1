import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss'], providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class OthersComponent implements OnInit {
  validatorType = ValidatorType
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  showHide = false;
  isTypeOfCommodity = false;
  isMarketValue = false;
  others: any;
  othersNominee: any;
  ownerData: any;
  advisorId: any;
  clientId: any;
  nomineesListFM: any;
  nomineesList: any;
  flag: any;
  otherData: any;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe, public utils: UtilService, public eventService: EventService) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Others';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getdataForm(this.data);
  }

  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }

  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
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
    // this.flag = data;
    // (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''
    if (data == undefined) {
      data = {};
      this.flag = "addOTHERS";
    }
    else {
      this.flag = "editOTHERS";
    }
    this.otherData = data;
    this.others = this.fb.group({
      ownerName: [(data.ownerName == undefined) ? '' : data.ownerName, [Validators.required]],
      typeOfCommodity: [(data.commodityTypeId == undefined) ? '' : (data.commodityTypeId) + '', [Validators.required]],
      marketValue: [(data.marketValue == undefined) ? '' : (data.marketValue), [Validators.required]],
      purchaseValue: [(data.purchaseValue == undefined) ? '' : (data.purchaseValue),],
      dateOfPurchase: [(data.dateOfPurchase == undefined) ? '' : new Date(data.dateOfPurchase)],
      growthRate: [(data.growthRate == undefined) ? '' : data.growthRate,],
      description: [(data.description == undefined) ? '' : data.description,],
      id: [(data.id == undefined) ? '' : data.id,],
      familyMemberId: [[(data.familyMemberId == undefined) ? '' : data.familyMemberId],]
    });
    // this.othersNominee = this.fb.group({})
    this.ownerData = this.others.controls;
    this.familyMemberId = this.others.value.familyMemberId;
  }


  // get nominee() {
  //   return this.othersNominee.get('NomineesList') as FormArray;
  // }

  getFormControl(): any {
    return this.others.controls;
  }

  saveOthers() {
    console.log("form group ::::::::::::", this.others);
    this.inputs.find(input => !input.ngControl.valid).focus();
    if (this.others.invalid) {
      this.others.markAllAsTouched();
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
        dateOfPurchase: (this.others.controls.dateOfPurchase.touched) ? this.datePipe.transform(this.others.controls.dateOfPurchase.value, 'yyyy-MM-dd') : this.others.controls.dateOfPurchase.value,
        description: this.others.controls.description.value,
        id: this.others.controls.id.value
      };
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == "addOTHERS") {
        delete obj.id;
        this.custumService.addOthers(obj).subscribe(
          data => this.addOthersRes(data)
        );
      } else if (this.flag == 'adviceOTHERS') {
        this.custumService.getAdviceOthers(adviceObj).subscribe(
          data => this.getAdviceOthersRes(data),
        );
      } else {
        // edit call
        this.custumService.editOthers(obj).subscribe(
          data => this.editOthersRes(data)
        );
      }
    }
  }
  getAdviceOthersRes(data) {
    this.eventService.openSnackBar('Others added successfully', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });

  }
  addOthersRes(data) {
    console.log('addrecuringDepositRes', data);
    this.eventService.openSnackBar('Others added successfully', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }

  editOthersRes(data) {
    this.eventService.openSnackBar('Others edited successfully', 'Dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data, refreshRequired: true });
  }

}
