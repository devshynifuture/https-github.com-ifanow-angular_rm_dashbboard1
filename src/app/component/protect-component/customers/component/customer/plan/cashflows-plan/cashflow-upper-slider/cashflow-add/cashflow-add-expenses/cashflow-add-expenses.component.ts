import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { CashFlowsPlanService } from '../../../cashflows-plan.service';

@Component({
  selector: 'app-cashflow-add-expenses',
  templateUrl: './cashflow-add-expenses.component.html',
  styleUrls: ['./cashflow-add-expenses.component.scss']
})
export class CashflowAddExpensesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cashflowService: CashFlowsPlanService
  ) { }

  validatorType = ValidatorType;
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

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

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  cashflowAddExpense(data) {
    this.cashflowService
      .cashflowAddExpenses({ advisorId: this.advisorId, clientId: this.clientId, data })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
  }

  editCashflowExpenseData(data) {
    this.cashflowService
      .cashflowEditExpenses({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      });
  }

  submitForm() {
    console.log(this.formExpense);
  }

}
