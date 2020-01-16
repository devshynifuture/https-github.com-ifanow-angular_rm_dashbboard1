import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-cashflow-add-expense',
  templateUrl: './cashflow-add-expense.component.html',
  styleUrls: ['./cashflow-add-expense.component.scss']
})
export class CashflowAddExpenseComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
