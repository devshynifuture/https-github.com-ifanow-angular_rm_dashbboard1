import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-multi-transaction-popup',
  templateUrl: './multi-transaction-popup.component.html',
  styleUrls: ['./multi-transaction-popup.component.scss']
})
export class MultiTransactionPopupComponent implements OnInit {
  dataSource: any;
  childTransactions: any;
  multiTransact: boolean;
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount',];

  constructor(public dialogRef: MatDialogRef<MultiTransactionPopupComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    console.log('multitransact',this.data)
    this.multiTransact = true
    this.dataSource = this.data.dataSource
    this.childTransactions = this.data.childTransactions
  }
  confrim(){
    this.dialogRef.close(true)
  }
  close(){
    this.dialogRef.close(false)
  }
}
