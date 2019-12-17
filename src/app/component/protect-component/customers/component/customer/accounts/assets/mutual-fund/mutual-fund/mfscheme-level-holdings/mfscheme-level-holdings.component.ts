import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder) { }
  @Input()
  set data(inputData) {
    this._data = inputData;
    this.getSchemeLevelHoldings(inputData);
  }
  get data() {
    return this._data;
  }
  ngOnInit() {
  }

  getSchemeLevelHoldings(data) {
    if (data == undefined) {
      data = {};
    }
    this.schemeLevelHoldingForm = this.fb.group({
      ownerName: [data.ownerName , [Validators.required]],
      dateOfReceipt: [new Date(data.dateOfReceived), [Validators.required]],
      creditorName: [data.creditorName, [Validators.required]],
      amtBorrowed:[data.amountBorrowed,[Validators.required]],
      interest: [data.interest, [Validators.required]],
      dateOfRepayment: [new Date(data.dateOfRepayment), [Validators.required]],
      balance: [data.outstandingBalance, [Validators.required]],
      collateral: [data.collateral],
    });

    this.ownerData = this.schemeLevelHoldingForm.controls;

  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.selectedFamilyData = value
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
