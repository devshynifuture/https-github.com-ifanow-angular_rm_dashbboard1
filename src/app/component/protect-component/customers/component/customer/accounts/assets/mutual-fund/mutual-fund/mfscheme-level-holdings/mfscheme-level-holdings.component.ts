import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-mfscheme-level-holdings',
  templateUrl: './mfscheme-level-holdings.component.html',
  styleUrls: ['./mfscheme-level-holdings.component.scss']
})
export class MFSchemeLevelHoldingsComponent implements OnInit {
  _data: any;
  schemeLevelHoldingForm: any;
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  nomineesListFM: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder) { }
  @Input()
  set data(data) {
    this._data = data;
    this.getSchemeLevelHoldings(data);
  }
  get data() {
    return this._data;
  }
  ngOnInit() {
    console.log(this._data)
  }

  getSchemeLevelHoldings(data) {
    if (data == null) {
      data = {};
    }
    this.schemeLevelHoldingForm = this.fb.group({
      ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      schemeName: [data.schemeName, [Validators.required]],
      folioNumber: [data.folioNumber, [Validators.required]],
      sip: [data.sip, [Validators.required]],
      tag: [data.tag, [Validators.required]],
    });
    this.transactionArray.push(this.fb.group({
      transactionType: [, [Validators.required]],
      date: [, [Validators.required]],
      transactionAmount: [, [Validators.required]],
      Units: [, [Validators.required]],
      id: []
    }))
    this.ownerData = this.schemeLevelHoldingForm.controls;
  }
  transactionListForm = this.fb.group({
    transactionListArray: new FormArray([])
  })
  get transactionList() { return this.transactionListForm.controls };
  get transactionArray() { return this.transactionList.transactionListArray as FormArray };
  addTransactions() {
    this.transactionArray.push(this.fb.group({
      transactionType: [, [Validators.required]],
      date: [, [Validators.required]],
      transactionAmount: [, [Validators.required]],
      Units: [, [Validators.required]],
      id: []
    }))
  }
  removeTransactions(index) {
    (this.transactionArray.length == 1) ? console.log("cannot remove") : this.transactionArray.removeAt(index)
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.selectedFamilyData = value
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  saveMfSchemeLevel() {
    this.inputs.find(input => !input.ngControl.valid).focus();
    if (this.schemeLevelHoldingForm.invalid) {
      this.schemeLevelHoldingForm.get('ownerName').markAsTouched();
      this.schemeLevelHoldingForm.get('schemeName').markAsTouched();
      this.schemeLevelHoldingForm.get('folioNumber').markAsTouched();
      this.schemeLevelHoldingForm.get('sip').markAsTouched();
      this.schemeLevelHoldingForm.get('tag').markAsTouched();
      this.transactionArray.controls.forEach(element => {
        element.get('transactionType').markAsTouched();
        element.get('date').markAsTouched();
        element.get('transactionAmount').markAsTouched();
        element.get('Units').markAsTouched();
      });
    } else {
      const obj = {
        ownerName: (this.ownerName == null) ? this.schemeLevelHoldingForm.controls.ownerName.value : this.ownerName,
        schemeName: this.schemeLevelHoldingForm.controls.schemeName.value,
        folioNumber: this.schemeLevelHoldingForm.controls.folioNumber.value,
        sip: this.schemeLevelHoldingForm.controls.sip.value,
        tag: this.schemeLevelHoldingForm.controls.tag.value,
        transaction: []
      }
      this.transactionArray.value.forEach(element => {
        if (element) {
          let obj1 = {
            'transactionType': element.transactionType,
            'date': element.date,
            'transactionAmount': element.transactionAmount,
            'Units': element.Units

          }
          obj.transaction.push(obj1)
        }
      });
      console.log(obj);
      this.subInjectService.changeNewRightSliderState({ state: 'close' })

    }
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
