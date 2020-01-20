import { CashflowAddComponent } from './../cashflow-add.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cashflow-add-liabilities',
  templateUrl: './cashflow-add-liabilities.component.html',
  styleUrls: ['./cashflow-add-liabilities.component.scss']
})
export class CashflowAddLiabilitiesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

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


  shouldExpandLiabilities: boolean = false;

  toggleLiabilitiesExpansion() {
    this.shouldExpandLiabilities = !this.shouldExpandLiabilities;
  }

  submitForm() {
    console.log(this.formLiabilities);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
