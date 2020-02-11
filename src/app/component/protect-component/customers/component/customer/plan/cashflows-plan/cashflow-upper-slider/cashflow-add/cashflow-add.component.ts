import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-cashflow-add',
  templateUrl: './cashflow-add.component.html',
  styleUrls: ['./cashflow-add.component.scss']
})
export class CashflowAddComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cashFlowCategory = this.data.tableData.tableInUse;

  ngOnInit() { }
}

