import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomerService} from '../../../../customer.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {DatePipe} from '@angular/common';
import {MAT_DATE_FORMATS} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';

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

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.getdataForm()
  }

  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }

  getdataForm() {
    if (this.dataSource != undefined) {
      var data = this.dataSource
    }
    this.bonds = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      monthlyContribution: [(data == undefined) ? '' : data.monthlyContribution, [Validators.required]],
      commencementDate: [(data == undefined) ? '' : data.commencementDate, [Validators.required]],
      interestRate: [(data == undefined) ? '' : data.interestRate, [Validators.required]],
      compound: [(data == undefined) ? '' : data.interestCompoundingId, [Validators.required]],
      linkBankAc: [(data == undefined) ? '' : data.linkBankAc, [Validators.required]],
      tenure: [(data == undefined) ? '' : data.tenure, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      bankName: [(data == undefined) ? '' : data.bankName, [Validators.required]],
      ownerType: [(data == undefined) ? '' : data.ownerType, [Validators.required]],
      rdNo: [(data == undefined) ? '' : data.rdNo, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]]
    });

    this.getFormControl().ownerName.maxLength = 40;
    this.getFormControl().description.maxLength = 60;
    this.getFormControl().rdNo.maxLength = 10;
    this.getFormControl().bankName.maxLength = 15;
  }

  getFormControl(): any {
    return this.bonds.controls;
  }

  Close() {
  }

  keyPress(event) {
  }

  isMonthlyContribution;
  isInterestRate;
  isCompound;
  isCommencementDate;
  isTenure;

  saveRecuringDeposit() {
  }
}
