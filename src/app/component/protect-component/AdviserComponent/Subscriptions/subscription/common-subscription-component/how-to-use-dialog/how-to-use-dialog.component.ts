import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-how-to-use-dialog',
  templateUrl: './how-to-use-dialog.component.html',
  styleUrls: ['./how-to-use-dialog.component.scss']
})
export class HowToUseDialogComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<HowToUseDialogComponent>,@Inject(MAT_DIALOG_DATA) public fragmentData: any) { }

  ngOnInit() {
    console.log("fragmentData",this.fragmentData);
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
