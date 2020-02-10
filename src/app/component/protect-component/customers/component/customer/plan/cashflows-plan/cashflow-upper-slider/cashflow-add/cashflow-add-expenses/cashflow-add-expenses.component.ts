import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { CashFlowsPlanService } from '../../../cashflows-plan.service';
import { ConstantsService } from 'src/app/constants/constants.service';

@Component({
  selector: 'app-cashflow-add-expenses',
  templateUrl: './cashflow-add-expenses.component.html',
  styleUrls: ['./cashflow-add-expenses.component.scss']
})
export class CashflowAddExpensesComponent implements OnInit {
  familyMemberList: {}[];

  constructor(
    public dialogRef: MatDialogRef<CashflowAddExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cashflowService: CashFlowsPlanService,
    private constantsService: ConstantsService
  ) { }

  validatorType = ValidatorType;
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  expenseCategory = {};

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
    this.expenseCategory = this.constantsService.expenseList;
    this.getFamilyMemberData();
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
      });
  }

  getFamilyMemberData() {
    this.cashflowService
      .getFamilyMemberData({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        this.familyMemberList = res.familyMembersList;
        console.log(this.familyMemberList);
      });
  }

  getMonthFromDate(value) {
    console.log(value);
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
    if (this.formValidations()) {
      console.log(this.formExpense);
      this.closeDialog();
    }
    // this.formValidations();
  }

  formValidations() {
    for (let key in this.formExpense.controls) {
      if (this.formExpense.get(key).invalid) {
        this.formExpense.get(key).markAsTouched();
        return false;
      }
    }
    return (this.formExpense.valid) ? true : false;
  }

}
