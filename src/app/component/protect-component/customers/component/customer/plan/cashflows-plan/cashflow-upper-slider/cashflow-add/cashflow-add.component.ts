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

  validatorType = ValidatorType;

  cashFlowCategory = this.data.tableData.tableInUse;

  formIncome = this.fb.group({
    "earning-member": [, Validators.required],
    "income-src": [, Validators.pattern(/\d+/), Validators.required],
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
    "amount": [, Validators.pattern(/\d+/), Validators.required],
    "repeat-freq": [, Validators.required],
    "repeat-every": [, Validators.required],
    "starts-date": [, Validators.required],
    "starts-day": [, Validators.required],
    "continues-till": [, Validators.required],
    "continues-till-date": [, Validators.required],
    "payment-mode": [, Validators.required],
    "family-member": [, Validators.required]
  });


  ngOnInit() {
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
    }
  }

}
