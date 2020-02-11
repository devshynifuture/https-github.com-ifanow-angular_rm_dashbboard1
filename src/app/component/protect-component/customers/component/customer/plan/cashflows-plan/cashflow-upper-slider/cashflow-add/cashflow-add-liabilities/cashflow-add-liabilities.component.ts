import { AuthService } from 'src/app/auth-service/authService';
import { CashflowAddComponent } from './../cashflow-add.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CashFlowsPlanService } from '../../../cashflows-plan.service';

@Component({
  selector: 'app-cashflow-add-liabilities',
  templateUrl: './cashflow-add-liabilities.component.html',
  styleUrls: ['./cashflow-add-liabilities.component.scss']
})
export class CashflowAddLiabilitiesComponent implements OnInit {
  maxDate = new Date();
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  constructor(
    public dialogRef: MatDialogRef<CashflowAddLiabilitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cashflowService: CashFlowsPlanService
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

  cashflowAddLiabilitiesData(data) {
    this.cashflowService
      .cashflowAddLiabilities({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
  }

  cashflowEditLiabilitiesData(data) {
    this.cashflowService
      .cashflowEditLiabilities({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      });
  }

  submitForm() {
    console.log(this.formLiabilities);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
