import { AuthService } from './../../../../../../../../../../auth-service/authService';
import { CashFlowsPlanService } from './../../../cashflows-plan.service';
import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { EventService } from './../../../../../../../../../../Data-service/event.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
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
    private cashflowAddService: CashflowAddService,
    private eventService: EventService
  ) { }

  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  familyMemberList: {}[] = [];

  validatorType = ValidatorType;
  formIncome = this.fb.group({
    "earning-member": [, Validators.required],
    "income-type": [, [Validators.pattern(/\d+/), Validators.required]],
    "monthly-amt": [, Validators.required],
    "continues-till": [, Validators.required],
    "continues-till-date": [,],
    "income-growth-rate": [, Validators.required],
    "income-growth-rate-input": [, Validators.required],
    "income-period-start": [, Validators.required],
    "income-period-end": [, Validators.required],
    "next-appraisal-date": [,],
    "bonusList": new FormArray([
      this.fb.group({
        "bonus-date": [, Validators.required],
        "bonus-amt": [, Validators.required]
      })
    ])
  });

  get formBonusListArrayControls() {
    return this.formIncome.controls['bonusList'] as FormArray;
  }

  addNewBonusDataInFormArray() {
    this.formBonusListArrayControls.push(
      this.fb.group({
        "bonus-date": [,],
        "bonus-amt": [,]
      })
    );
  }

  removeBonusDataFromFormArray(index) {
    this.formBonusListArrayControls.controls.splice(index, 1);
  }

  ngOnInit() {
    this.getFamilyMemberData();
    console.log(this.formBonusListArrayControls.controls);
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

    if (this.cashflowAddService.formValidations(this.formIncome)) {
      console.log(this.formIncome);
      this.closeDialog();
    } else {
      this.eventService.openSnackBar('Must fill required fields', "DISMISS");
    }
    // api call for adding income

    const userInfo = AuthService.getUserInfo();
    const requestJSON = {
      familyMemberId: 5500000,
      clientId: userInfo.clientId,
      advisorId: userInfo.advisorId,
      ...this.formIncome
    }

    // console.log('this is income form ', this.formIncome);
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
