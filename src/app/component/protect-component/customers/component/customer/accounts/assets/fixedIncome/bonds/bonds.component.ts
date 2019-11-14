import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomerService} from '../../../../customer.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {DatePipe} from '@angular/common';
import {MAT_DATE_FORMATS} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service/authService';


@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.component.html',
  styleUrls: ['./bonds.component.scss'],
  providers: [
    [DatePipe],
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],
})
export class BondsComponent implements OnInit {
  dataSource: any;
  bonds: any;
  showHide = false;
  inputData: any;
  ownerName: any;
  isBondName = false
  isAmountInvest = false
  isCouponOption = false;
  isRateReturns = false;
  isType = false
  fdMonths: string[];
  tenure: any;
  maturityDate: any;
  getDate: string;
  selectedFamilyData: any;
  advisorId: any;
  familyMemberId: any;
  ownerData: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) {
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
    // this.getdataForm()
    this.advisorId = AuthService.getAdvisorId();
    this.fdMonths = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
  }
  Close(){
    this.subInjectService.changeNewRightSliderState({state:'close'})
  }
  getDateYMD(){
    this.tenure = this.bonds.controls.commencementDate.value.add(this.bonds.controls.tenure.value, 'months');
    this.getDate = this.datePipe.transform(this.tenure , 'yyyy-MM-dd')
    return this.getDate;
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  getdataForm(data) {
    if(data == undefined){
      data = {}
    }
    this.bonds = this.fb.group({
      ownerName: [(data == undefined) ? '' : this.ownerName , [Validators.required]],
      bondName: [(data == undefined) ? '' : data.bondName, [Validators.required]],
      type:[(data == undefined) ? '' : data.type, [Validators.required]],
      amountInvest:[(data == undefined)?'': data.amountInvest,[Validators.required]],
      rateReturns:[(data == undefined)?'': data.rateReturns,[Validators.required]],
      couponOption:[(data == undefined)?'': data.couponOption,[Validators.required]],
      commencementDate: [(data == undefined) ? '' : data.commencementDate, [Validators.required]],
      interestRate: [(data == undefined) ? '' : data.interestRate, [Validators.required]],
      compound: [(data == undefined) ? '' : data.interestCompoundingId, [Validators.required]],
      linkBankAc: [(data == undefined) ? '' : data.linkBankAc, [Validators.required]],
      tenure: [(data == undefined) ? '' : data.tenure, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      bankName: [(data == undefined) ? '' : data.bankName, [Validators.required]],
      ownerType: [(data == undefined) ? '' : data.ownerType, [Validators.required]],
      rdNo: [(data == undefined) ? '' : data.rdNo, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId:[[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });

    this.getFormControl().description.maxLength = 60;
    this.getFormControl().rdNo.maxLength = 10;
    this.getFormControl().bankName.maxLength = 15;
    this.ownerData = this.bonds.controls;
    this.familyMemberId = this.bonds.controls.familyMemberId.value
    this.familyMemberId =  this.familyMemberId[0]
  }

  getFormControl(): any {
    return this.bonds.controls;
  }
  keyPress(event) {
  }

  isMonthlyContribution;
  isInterestRate;
  isCompound;
  isCommencementDate;
  isTenure;

  saveRecuringDeposit() {
    this.tenure = this.getDateYMD()
    this.maturityDate = this.tenure

  let obj = {
    advisorId:this.advisorId,
    clientId: 2978,
    familyMemberId: (this.familyMemberId == undefined)?this.familyMemberId:this.selectedFamilyData.id,
    ownerName: this.ownerName,
    amountInvest:this.bonds.amountInvest.value,
    bondName: this.bonds.controls.monthlyContribution.value,
    interestRate : this.bonds.controls.interestRate.value,
    commencementDate: this.datePipe.transform(this.bonds.controls.commencementDate.value, 'yyyy-MM-dd'),
    linkedBankAccount: this.bonds.controls.linkBankAc.value,
    description: this.bonds.controls.description.value,
    maturityDate: this.datePipe.transform( this.maturityDate, 'yyyy-MM-dd'),
    bankName: this.bonds.controls.bankName.value,
    compound: this.bonds.controls.interestCompoundingId.value,
    rdNumber: this.bonds.controls.rdNo.value,
    interestCompounding:this.bonds.controls.compound.value,
    id:this.bonds.controls.id.value
  }
}
}
