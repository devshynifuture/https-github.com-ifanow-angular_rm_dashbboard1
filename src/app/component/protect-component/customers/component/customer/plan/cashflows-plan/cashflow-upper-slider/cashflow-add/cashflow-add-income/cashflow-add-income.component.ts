import { AuthService } from './../../../../../../../../../../auth-service/authService';
import { CashFlowsPlanService } from './../../../cashflows-plan.service';
import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { EventService } from './../../../../../../../../../../Data-service/event.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CashflowAddService } from '../cashflow-add.service';

@Component({
  selector: 'app-cashflow-add-income',
  templateUrl: './cashflow-add-income.component.html',
  styleUrls: ['./cashflow-add-income.component.scss']
})
export class CashflowAddIncomeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddIncomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cashflowService: CashFlowsPlanService,
    private cashflowAddService: CashflowAddService
  ) { }

  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  familyMemberList: {}[] = [];

  validatorType = ValidatorType;
  formIncome = this.fb.group({
    "earning-member": [, Validators.required],
    "income-src": [, [Validators.pattern(/\d+/), Validators.required]],
    "monthly-amt": [, Validators.required],
    "continues-till": [, Validators.required],
    "continues-till-date": [, Validators.required],
    "income-growth-rate": [, Validators.required],
    "income-growth-rate-input": [, Validators.required],
    "income-period-start": [, Validators.required],
    "income-period-end": [, Validators.required],
    "next-appraisal-date": [,],
    "bonus-date": [,],
    "bonus-amt": [,]
  });

  ngOnInit() {
    this.getFamilyMemberData();
  }

  // editing multiple values
  editCashflowMonthlyIncomeTableData(values) {
    this.cashflowService
      .cashflowEditMonthlyIncomeValues({ advisorId: this.advisorId, clientId: this.clientId, values })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      });
  }

  addCashflowIncome() {
    this.cashflowService
      .cashFlowAddIncome({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  addIncome() {
    //   "familyMemberId":5500000,
    // "clientId":2978,
    // "advisorId":2808,

    this.cashflowAddService.formValidations(this.formIncome) ? console.log(this.formIncome) : '';
    // api call for adding income
    const userInfo = AuthService.getUserInfo();
    const requestJSON = {
      familyMemberId: 5500000,
      clientId: userInfo.clientId,
      advisorId: userInfo.advisorId,
      ...this.formIncome
    }

    console.log('this is income form ', this.formIncome);
    // this.cashflowService.cashFlowAddIncome(requestJSON).subscribe(res => {
    //   console.log('this is res for cashflow add', res);
    // }, err => {
    //   console.error('this is some error in cashflow add::', err)
    // })
  }

  getFamilyMemberData() {
    this.cashflowService
      .getFamilyMemberData({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log("family member ::::::::::::", res);
        this.familyMemberList = res.familyMembersList;
        console.log(this.familyMemberList);
      });
  }
}
