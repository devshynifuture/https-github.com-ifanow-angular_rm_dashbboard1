import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { CashFlowsPlanService } from '../../../cashflows-plan.service';
import { ConstantsService } from 'src/app/constants/constants.service';
import { CashflowAddService } from './../cashflow-add.service';

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
    private constantsService: ConstantsService,
    private cashflowAddService: CashflowAddService
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
    this.cashflowAddService.formValidations(this.formExpense) ? console.log(this.formExpense.value) : '';
  }
}
