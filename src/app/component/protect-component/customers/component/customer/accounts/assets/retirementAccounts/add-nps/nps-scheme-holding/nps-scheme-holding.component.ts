import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-nps-scheme-holding',
  templateUrl: './nps-scheme-holding.component.html',
  styleUrls: ['./nps-scheme-holding.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],

})
export class NpsSchemeHoldingComponent implements OnInit {
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  schemeHoldingsNPS: any;
  advisorId: any;
  ownerData: any;

  constructor(private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) { }
  @Input()
  set data(data) {
    this.inputData = data;
   this.getdataForm(data);
  }
  isPran = false;
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId()
  }

  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }

  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }

    this.schemeHoldingsNPS = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      currentValue: [(data == undefined) ? '' : data.currentValuation, [Validators.required]],
      valueAsOn: [(data == undefined) ? '' : new Date(data.valueAsOn), [Validators.required]],
      schemeChoice: [(data == undefined) ? '' : data.schemeChoice, [Validators.required]],
      pran: [(data == undefined) ? '' : data.pran, [Validators.required]],
      totalContry: [(data == undefined) ? '' : data.contributionAmount, [Validators.required]],
      allocation: [(data == undefined) ? '' : data.allocation, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      holdingList: this.fb.array([this.fb.group({
        schemeName: null, holdingAsOn: null,
        totalUnits: null, totalNetContry: null
      })]),
      futureContributionList: this.fb.array([this.fb.group({
        frequencyId: null,
        accountPreferenceId: null, approxContribution: null
      })]),
      npsNomineesList: this.fb.array([this.fb.group({
        nomineeName: null,allocation:null,
      })]),
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.schemeHoldingsNPS.controls;
    this.familyMemberId = this.schemeHoldingsNPS.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]

  }
  get holdings() {
    return this.schemeHoldingsNPS.get('holdingList') as FormArray;
  }
  addHoldings() {
    this.holdings.push(this.fb.group({
      schemeName: null, holdingAsOn: null,
      totalUnits: null, totalNetContry: null
    }));

  }
  removeHoldings() {

  }
  get futureContry() {
    return this.schemeHoldingsNPS.get('futureContributionList') as FormArray;
  }
  addFutureContry() {
    this.futureContry.push(this.fb.group({
      frequencyId: null,
      accountPreferenceId: null, approxContribution: null
    }));

  }
  removeFutureContry(item) {
    if (this.futureContry.value.length > 1) {
      this.futureContry.removeAt(item);
    }
  }
  get nominee() {
    return this.schemeHoldingsNPS.get('npsNomineesList') as FormArray;
  }
  addNominee() {
    this.nominee.push(this.fb.group({
      nomineeName: null,nomineePercentageShare:null,
    }));
  }
  removeNominee(item) {
    if (this.nominee.value.length > 1) {
      this.nominee.removeAt(item);
    }
  }
  getFormControl(): any {
    return this.schemeHoldingsNPS.controls;
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
  saveSchemeHoldings() {
    // if (this.schemeHoldingsNPS.controls.valueAsOn.invalid) {
    //   this.isValueAsOn = true;
    //   return;
    // } else if (this.schemeHoldingsNPS.controls.totalContry.invalid) {
    //   this.isTotalContry = true;
    //   return;
    // } else if (this.schemeHoldingsNPS.controls.currentValue.invalid) {
    //   this.isCurrentValue = true;
    //   return;
    // } else {
    //   let obj = {
    //     advisorId: this.advisorId,
    //     clientId: 2978,
    //     familyMemberId: this.familyMemberId,
    //     ownerName: (this.ownerName == undefined) ? this.schemeHoldingsNPS.controls.ownerName.value : this.ownerName,
    //     valueAsOn: this.datePipe.transform(this.schemeHoldingsNPS.controls.valueAsOn.value, 'yyyy-MM-dd'),
    //     currentValuation: this.schemeHoldingsNPS.controls.currentValue.value,
    //     contributionAmount: this.schemeHoldingsNPS.controls.totalContry.value,
    //     pran: this.schemeHoldingsNPS.controls.pran.value,
    //     schemeChoice: this.schemeHoldingsNPS.controls.schemeChoice.value,
    //     futureContributionList: this.schemeHoldingsNPS.controls.futureContributionList.value,
    //     npsNomineesList: this.schemeHoldingsNPS.controls.npsNomineesList.value,
    //     description: this.schemeHoldingsNPS.controls.description.value,
    //     id: this.schemeHoldingsNPS.controls.id.value
    //   }
    //   if (this.schemeHoldingsNPS.controls.id.value == undefined) {
    //     this.custumService.addNPS(obj).subscribe(
    //       data => this.addNPSRes(data)
    //     );
    //   } else {
    //     //edit call
    //     this.custumService.editNPS(obj).subscribe(
    //       data => this.editNPSRes(data)
    //     );
    //   }
    // }
  }
}
