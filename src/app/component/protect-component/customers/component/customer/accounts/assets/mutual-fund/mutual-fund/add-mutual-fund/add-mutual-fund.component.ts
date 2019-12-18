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
  nexNomineePer: number;
  showError: boolean;

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
      amtInvested: [data.amountInvested, [Validators.required]],
      description: [data.description],
      getNomineeName: this.fb.array([this.fb.group({
        name: null,
        ownershipPer: null,
      })]),
      ownerPercent: [data.ownershipPer, [Validators.required]],

    })
    this.ownerData = this.MfForm.controls;
    console.log(this.MfForm)
  }
  SavePorfolio() {
    if (this.MfForm.get('currentMarketValue').invalid) {
      this.MfForm.get('currentMarketValue').markAsTouched();
      return;
    } else if (this.MfForm.get('valueAsOn').invalid) {
      this.MfForm.get('valueAsOn').markAsTouched();
      return;
    } else if (this.MfForm.get('amtInvested').invalid) {
      this.MfForm.get('amtInvested').markAsTouched();
      return;
    } else {
      const obj = {
        ownerName: (this.ownerName == null) ? this.MfForm.controls.ownerName.value : this.ownerName,
        currentMarketValue: this.MfForm.controls.currentMarketValue.value,
        valueAsOn: this.MfForm.controls.valueAsOn.value,
        amtInvested: this.MfForm.controls.amtInvested.value,
        description: this.MfForm.controls.description.value,
        nominee: []
      }
      this.MfForm.value.getNomineeName.forEach(element => {
        if (element) {
          let obj1 = {
            'name': element.name,
            'ownershipPer': parseInt(element.ownershipPer)
          }
          obj.nominee.push(obj1)
        }
      });
      console.log(obj);
      this.subInjectService.changeNewRightSliderState({ state: 'close' })

    }
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
  addNominee() {
    this.nexNomineePer = 0;
    this.getNominee.value.forEach(element => {
      this.nexNomineePer += element.ownershipPer
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
    if (this.showError == false) {
      this.getNominee.push(this.fb.group({
        name: null, ownershipPer: null,
      }));
    }
  }
  removeNominee(item) {
    if (this.getNominee.value.length > 1) {
      this.getNominee.removeAt(item);
    }
    this.nexNomineePer = 0;
    this.getNominee.value.forEach(element => {
      this.nexNomineePer += element.ownershipPer
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }

  }
  onChange(data) {
    this.nexNomineePer = 0;
    this.getNominee.value.forEach(element => {
      this.nexNomineePer += element.ownershipPer
    });
    if (this.nexNomineePer > 100) {
      this.showError = true
      console.log('show error Percent cannot be more than 100%')
    } else {
      this.showError = false
    }
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
