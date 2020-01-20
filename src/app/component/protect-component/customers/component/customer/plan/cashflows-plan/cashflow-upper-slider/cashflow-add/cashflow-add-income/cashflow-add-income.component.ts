import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { EventService } from './../../../../../../../../../../Data-service/event.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cashflow-add-income',
  templateUrl: './cashflow-add-income.component.html',
  styleUrls: ['./cashflow-add-income.component.scss']
})
export class CashflowAddIncomeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddIncomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) { }

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
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitForm() {
    console.log('this is income form ', this.formIncome);
  }

}
