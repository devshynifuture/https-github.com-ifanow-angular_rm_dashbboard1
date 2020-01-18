import { EventService } from './../../../../../../../../../Data-service/event.service';
import { ValidatorType } from './../../../../../../../../../services/util.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cashflow-add',
  templateUrl: './cashflow-add.component.html',
  styleUrls: ['./cashflow-add.component.scss']
})
export class CashflowAddComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private eventService: EventService
  ) { }

  dataSource1: GoalTableI[] = ELEMENT_DATA1;
  dataSource2: loanTableI[] = ELEMENT_DATA2;
  displayedColumns1: string[] = ['goal', 'goalYear', "monthlyRequired", 'lumpsumRequired', 'allocate'];;
  displayedColumns2: string[] = ['loan', 'loanYear', "monthlyRequired", 'lumpsumRequired', 'allocate'];;

  surplusTabState = 'goal';

  validatorType = ValidatorType;

  cashFlowCategory = this.data.tableData.tableInUse;
  shouldExpandLiabilities: boolean = false;

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


  formExpense = this.fb.group({
    "category": [, Validators.required],
    "amount": [, [Validators.pattern(/\d+/), Validators.required]],
    "repeat-freq": [, Validators.required],
    "repeat-every": [, Validators.required],
    "starts-date": [, Validators.required],
    "starts-day": [, Validators.required],
    "continues-till": [, Validators.required],
    "continues-till-date": [, Validators.required],
    "payment-mode": [, Validators.required],
    "family-member": [, Validators.required]
  });

  formLiabilities = this.fb.group({
    "owner": [, Validators.required],
    "loan-type": [, Validators.required],
    "original-amt-loan": [, Validators.required],
    "loan-tenure": [, Validators.required],
    "commencement-date": [, Validators.required],
    "emi-freq": [, Validators.required],
    "annual-interest-rate": [, Validators.required],
    "emi": [,],
    "financial-institution": [,],
    "collateral": [,]
  })


  ngOnInit() {

  }

  toggleLiabilitiesExpansion() {
    this.shouldExpandLiabilities = !this.shouldExpandLiabilities;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.cashFlowCategory === 'income') {
      // income api 
      console.log(this.formIncome);

    } else if (this.cashFlowCategory === 'expense') {
      // expense api

      console.log(this.formExpense);
    } else if (this.cashFlowCategory === 'liabilities') {
      // liabilities

      console.log(this.formLiabilities);
    }
  }

}

export interface GoalTableI {
  goal: string,
  goalYear: string,
  monthlyRequired: string,
  lumpsumRequired: string,
  allocate: string
}

export interface loanTableI {
  loan: string,
  loanYear: string,
  monthlyRequired: string,
  lumpsumRequired: string,
  allocate: string
}

export const ELEMENT_DATA1: GoalTableI[] = [
  { goal: 'deasvikandk', goalYear: '2020', monthlyRequired: '83494', lumpsumRequired: '2409809', allocate: "" }
]

export const ELEMENT_DATA2: loanTableI[] = [
  { loan: "adhvgbha", loanYear: '2020', monthlyRequired: '48978', lumpsumRequired: '948735', allocate: '' }
]
