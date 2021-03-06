import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-subscription-popup',
  templateUrl: './subscription-popup.component.html',
  styleUrls: ['./subscription-popup.component.scss']
})
export class SubscriptionPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SubscriptionPopupComponent>, @Inject(MAT_DIALOG_DATA) public fragmentData: any) { }
  display;
  ngOnInit() {
    this.display = 1;

  }
  getData(value) {
    this.display = value;
  }

}
