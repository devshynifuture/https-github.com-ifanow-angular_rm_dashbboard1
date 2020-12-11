import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-msg-dailog',
  templateUrl: './msg-dailog.component.html',
  styleUrls: ['./msg-dailog.component.scss']
})
export class MsgDailogComponent implements OnInit {
  headerData: any;
  msgArr = [];
  msg: any;
  constructor(public dialogRef: MatDialogRef<MsgDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,) { }
  ngOnInit() {
    this.headerData = this.dialogData.head;
    if (this.dialogData.data.length > 0) {
      this.msgArr = this.dialogData.data;
    }
    this.headerData = this.dialogData.head;
  }

  close() {
    this.dialogRef.close();
  }
}
