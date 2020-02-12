import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CashflowAddComponent } from './../cashflow-add.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CashFlowsPlanService } from '../../../cashflows-plan.service';
import { CashflowAddService } from '../cashflow-add.service';

@Component({
  selector: 'app-cashflow-add-liabilities',
  templateUrl: './cashflow-add-liabilities.component.html',
  styleUrls: ['./cashflow-add-liabilities.component.scss']
})
export class CashflowAddLiabilitiesComponent implements OnInit {
  maxDate = new Date();
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  showTransact: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CashflowAddLiabilitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cashflowService: CashFlowsPlanService,
    private cashflowAddService: CashflowAddService
  ) { }

  ownerData;
  validatorType = ValidatorType;

  ngOnInit() {
    this.ownerData = this.formLiabilities.controls;
  }

  formLiabilities = this.fb.group({
    "ownerName": [, Validators.required],
    "loan-type": [, Validators.required],
    "original-amt-loan": [, Validators.required],
    "loan-tenure": [, Validators.required],
    "commencement-date": [, Validators.required],
    "emi-freq": [, Validators.required],
    "annual-interest-rate": [, Validators.required],
    "emi": [,],
    "financial-institution": [,],
    "collateral": [,],
    "transact": this.fb.array([
      this.fb.group({
        "partPaymentDate": [, Validators.required],
        "partPaymentAmount": [, Validators.required],
        "partPaymentOptions": [, Validators.required]
      })
    ])
  });


  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = '100';
      this.formLiabilities.get('annual-interest-rate').setValue(event.target.value);
    }
  }

  addTransaction() {
    (this.formLiabilities.get('transact') as FormArray).push(
      this.fb.group({
        "partPaymentDate": [,],
        "partPaymentAmount": [,],
        "partPaymentOptions": [,]
      })
    );
  }

  toggleTransact() {
    this.showTransact = !this.showTransact;
  }

  removeTransaction(index) {
    (this.formLiabilities.get('transact') as FormArray).controls.splice(index, 1);
  }

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

  getFormArrayControlsOfTransact() {
    return (this.formLiabilities.get('transact') as FormArray).controls;
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
    console.log(this.formLiabilities.value);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
