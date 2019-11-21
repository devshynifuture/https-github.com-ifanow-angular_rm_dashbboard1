import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

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
  isPran = false
  advisorId: any;
  ownerData: any;
  schemes: any[];
  schemeList: any;
  idForscheme: any;
  idForscheme1: any[];
  clientId: any;

  constructor(private event : EventService, private router: Router, private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) { }
  @Input()
  set data(data) {
    this.inputData = data;
   this.getdataForm(data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.idForscheme1  = []
    this.advisorId = AuthService.getAdvisorId()
    this.clientId = AuthService.getClientId();
    this.getGlobalList()
  
  }

  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  getGlobalList(){
    this.custumService.getGlobal().subscribe(
        data => this.getGlobalRes(data)
    );
  }
  getGlobalRes(data){
 
    console.log('getGlobalRes',data)
    this.schemeList = data.npsScheme;
  }
  
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.schemeHoldingsNPS = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      schemeChoice: [(data == undefined) ? '' : (data.schemeChoice)+"", [Validators.required]],
      pran: [(data == undefined) ? '' : data.pran, [Validators.required]],
      schemeName:[(data == undefined) ? '' : data.schemeName, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      holdingList: this.fb.array([this.fb.group({
        schemeName: null, holdingAsOn: null,
        totalUnits: null, totalNetContribution: null
      })]),
      futureContributionList: this.fb.array([this.fb.group({
        frequencyId: null,
        accountPreferenceId: null, approxContribution: null
      })]),
      npsNomineesList: this.fb.array([this.fb.group({
        nomineeName: null,nomineePercentageShare:null,
      })]),
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.schemeHoldingsNPS.controls;
    this.familyMemberId = this.schemeHoldingsNPS.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
    if (data.futureContributionList != undefined || data.npsNomineesList != undefined || data.holdingList != undefined) {
      data.futureContributionList.forEach(element => {
        this.schemeHoldingsNPS.controls.futureContributionList.push(this.fb.group({
          frequencyId: [(element.frequencyId) + "", [Validators.required]],
          accountPreferenceId: [(element.accountPreferenceId + ""), Validators.required],
          approxContribution: [(element.approxContribution), Validators.required]
        }))
      })
      data.npsNomineesList.forEach(element => {
        this.schemeHoldingsNPS.controls.npsNomineesList.push(this.fb.group({
          nomineeName: [(element.nomineeName), [Validators.required]],
          nomineePercentageShare: [element.nomineePercentageShare , Validators.required],
        }))
      })
      data.holdingList.forEach(element => {
        this.schemeHoldingsNPS.controls.holdingList.push(this.fb.group({
          schemeName: [(element.schemeId) + "", [Validators.required]],
          totalUnits: [(element.totalUnits), Validators.required],
          totalNetContribution: [(element.totalNetContribution), Validators.required],
          holdingAsOn:[new Date(element.totalNetContribution), Validators.required],
        }))
      })
      this.nominee.removeAt(0);
      this.futureContry.removeAt(0);
      this.holdings.removeAt(0);
    }

  }
  get holdings() {
    return this.schemeHoldingsNPS.get('holdingList') as FormArray;
  }
  addHoldings() {
    this.holdings.push(this.fb.group({
      schemeName: null, holdingAsOn: null,
      totalUnits: null, totalNetContribution: null
    }));

  }
  removeHoldings(item) {
    if(this.holdings.value.length>1){
      this.holdings.removeAt(item)
    }
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
  saveSchemeHolding() {
    if (this.schemeHoldingsNPS.controls.pran.invalid) {
      this.isPran = true;
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.schemeHoldingsNPS.controls.ownerName.value : this.ownerName,
        pran: this.schemeHoldingsNPS.controls.pran.value,
        holdingList:this.schemeHoldingsNPS.controls.holdingList.value,
        futureContributionList: this.schemeHoldingsNPS.controls.futureContributionList.value,
        npsNomineesList: this.schemeHoldingsNPS.controls.npsNomineesList.value,
        description: this.schemeHoldingsNPS.controls.description.value,
        id: this.schemeHoldingsNPS.controls.id.value
      }
      if (this.schemeHoldingsNPS.controls.id.value == undefined) {
        this.custumService.addNPS(obj).subscribe(
          data => this.addNPSRes(data)
        );
      } else {
        //edit call
        this.custumService.editNPS(obj).subscribe(
          data => this.editNPSRes(data)
        );
      }
    }
  }
  addNPSRes(data){
    this.event.openSnackBar('Added successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
  editNPSRes(data){
    this.event.openSnackBar('Updated successfully!', 'dismiss');
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
}
