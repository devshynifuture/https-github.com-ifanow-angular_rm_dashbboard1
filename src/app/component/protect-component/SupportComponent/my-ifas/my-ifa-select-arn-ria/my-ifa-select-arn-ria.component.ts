import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-my-ifa-select-arn-ria',
  templateUrl: './my-ifa-select-arn-ria.component.html',
  styleUrls: ['./my-ifa-select-arn-ria.component.scss']
})
export class MyIfaSelectArnRiaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MyIfaSelectArnRiaComponent>,
    @Inject(MAT_DIALOG_DATA) public fragmentData: any
  ) { }

  ngOnInit() {
  }

  dialogClose() {
    this.dialogRef.close();
  }



}
