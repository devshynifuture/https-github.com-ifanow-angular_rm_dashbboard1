import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-mutual-fund',
  templateUrl: './add-mutual-fund.component.html',
  styleUrls: ['./add-mutual-fund.component.scss']
})
export class AddMutualFundComponent implements OnInit {
  MfData: any;
  MfForm: any;
  ownerData: any;
  nomineesListFM: any;
  _data: any;
  ownerName: any;
  selectedFamilyData: any;
  dataFM: any;
  familyList: any[];

  constructor(private fb: FormBuilder, public subInjectService: SubscriptionInject) { }

  // @Input()
  // set data(inputData) {
  //   this._data = inputData;
  //   this.getMutualFund(inputData);

  // }

  // get data() {
  //   return this._data;
  // }
  ngOnInit() {
  }
  @Input() set data(data) {
    if (data == null) {
      data = {}
    }
    else {
      this.MfData = data
    }
    this.MfForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      currentMarketValue: [data.currentMarketValue, [Validators.required]],
      valueAsOn: [new Date(data.valueAsOn), [Validators.required]],
      amtInvested: [data.amountInvested,],
      description: [data.description, [Validators.required]],
      getNomineeName: this.fb.array([this.fb.group({
        name: null,
        ownershipPer: null,
      })])
    })
    this.ownerData = this.MfForm.controls;
    console.log(this.MfForm)
  }
  // getMutualFund(data){
  //   this.MfForm = this.fb.group({
  //     ownerName: [data.ownerName, [Validators.required]],
  //     currentMarketValue: [data.currentMarketValue, [Validators.required]],
  //     valueAsOn: [new Date(data.valueAsOn), [Validators.required]],
  //     amtInvested: [data.amountInvested,],
  //     description: [data.description, [Validators.required]],
  //     nominee: [new Date(data.nominee), [Validators.required]]

  //   })
  //   this.ownerData = this.MfForm.controls;
  // }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.selectedFamilyData = value
  }
  nomineesList() {
    this.dataFM = this.nomineesListFM
    if (this.dataFM.length > 0) {
      let name = this.ownerName
      var evens = _.reject(this.dataFM, function (n) {
        return n.userName == name;
      });
      this.familyList = evens
    }

    console.log('familyList', this.familyList)
  }
  getFormControl() {
    return this.MfForm.controls;
  }
  get getNominee() {
    return this.MfForm.get('getNomineeName') as FormArray;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
