import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-nps-summary-portfolio',
  templateUrl: './nps-summary-portfolio.component.html',
  styleUrls: ['./nps-summary-portfolio.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class NpsSummaryPortfolioComponent implements OnInit {
  ownerName: any;
  familyMemberId: any;
  inputData: any;
  summaryNPS: any;
  ownerData: any;
  isValueAsOn = false;
  isTotalContry = false;
  isCurrentValue = false;
  isFrequency = false;
  isApproxContry = false;
  isAccountPref = false
  constructor(private router: Router,private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) {
    this.summaryNPS = this.fb.group({
      published: true,
      futureContry: this.fb.array([]),
    });
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
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.summaryNPS = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      currentValue: [(data == undefined) ? '' : data.yearsCompleted, [Validators.required]],
      valueAsOn: [(data == undefined) ? '' : data.amountReceived, [Validators.required]],
      futureContry:[],
      totalContry: [(data == undefined) ? '' : data.organizationName, [Validators.required]],
      resonOfRecipt: [(data == undefined) ? '' : data.reasonOfReceipt, [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      frequency:[(data == undefined) ? '' : data.frequency, [Validators.required]],
      accountPref:[(data == undefined) ? '' : data.accountPref, [Validators.required]],
      approxContry:[(data == undefined) ? '' : data.approxContry, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.summaryNPS.controls;
    this.familyMemberId = this.summaryNPS.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
    
  }
  getFormControl(): any {
    return this.summaryNPS.controls;
  }
  addFutureContry() {
    const creds = this.summaryNPS.controls.futureContry as FormArray;
    creds.push(this.fb.group({
      frequency: '',
      approxContry: '',
      accountPref:'',
    }));
  }
}
