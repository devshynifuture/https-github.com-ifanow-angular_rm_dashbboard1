import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';

@Component({
  selector: 'app-refer-and-earn-popups',
  templateUrl: './refer-and-earn-popups.component.html',
  styleUrls: ['./refer-and-earn-popups.component.scss']
})
export class ReferAndEarnPopupsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReferAndEarnPopupsComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
