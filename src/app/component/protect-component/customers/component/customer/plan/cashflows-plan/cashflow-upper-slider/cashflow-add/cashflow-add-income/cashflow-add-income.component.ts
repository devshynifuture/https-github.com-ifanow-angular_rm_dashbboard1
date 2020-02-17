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
  ownerName: any;
  familyMemberId: any;

  constructor(
    public dialogRef: MatDialogRef<CashflowAddIncomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cashflowService: CashFlowsPlanService,
    private cashflowAddService: CashflowAddService,
    private eventService: EventService
  ) {
  }

  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  familyMemberList: {}[];

  ownerData;

  validatorType = ValidatorType;
  formIncome = this.fb.group({
    "ownerName": [, Validators.required],
    "incomeTypeId": [, [Validators.pattern(/\d+/), Validators.required]],
    "monthlyIncome": [, Validators.required],
    "continueTill": [, Validators.required],
    "continueTillDate": [,],
    "growthRate": [, Validators.required],
    "income-growth-rate-input": [, Validators.required],
    "income-period-start": [, Validators.required],
    "income-period-end": [, Validators.required],
    "nextAppraisalOrNextRenewal": [,],
    "bonusList": new FormArray([
      this.fb.group({
        "bonus-date": [, Validators.required],
        "bonus-amt": [, Validators.required]
      })
    ])
  });

  get formBonusListArrayControls() {
    return this.formIncome.get('bonusList') as FormArray;
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
    console.log(this.data);
    this.ownerData = this.formIncome.controls;
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

    const requestJSON = {
      "familyMemberId": 5500000,
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "ownerName": this.formIncome.get('ownerName').value,
      "monthlyIncome": this.formIncome.get('monthlyIncome').value,
      "incomeStartMonth": 1,
      "incomeStartYear": 2019,
      "incomeEndMonth": 4,
      "incomeEndYear": 2020,
      "incomeGrowthRateId": 50,
      "growthRate": 20,
      "incomeStyleId": 20,
      "continueTill": parseInt(this.formIncome.get('continueTill').value),
      "nextAppraisalOrNextRenewal": parseInt(this.formIncome.get('nextAppraisalOrNextRenewal').value),
      "incomeTypeId": parseInt(this.formIncome.get('incomeTypeId').value),
      "realEstateId": 20,
      "basicIncome": 200,
      "standardDeduction": 200,
      "deamessAlowance": 200,
      "hraRecieved": 200,
      "totalRentPaid": 200,
      "addedFromCashFlow": 1,
      "description": "description",
      "monthlyContributions": [
        {
          "amount": 200,
          "receivingMonth": 1,
          "receivingYear": "2019"
        },
        {
          "amount": 200,
          "receivingMonth": 2,
          "receivingYear": "2019"
        }
      ]
    }

    this.cashflowService.cashFlowAddIncome(requestJSON).subscribe(res => {

      // gives incomeId of newly created income inside cashflow
      console.log("this is some response frmo add income apio", res);
    })

    // console.log('this is income form ', this.formIncome);
    // this.cashflowService.cashFlowAddIncome(requestJSON).subscribe(res => {
    //   console.log('this is res for cashflow add', res);
    // }, err => {
    //   console.error('this is some error in cashflow add::', err)
    // })
  }
}
