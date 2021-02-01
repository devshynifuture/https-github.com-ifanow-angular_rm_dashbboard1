import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-openmobile-popup',
  templateUrl: './openmobile-popup.component.html',
  styleUrls: ['./openmobile-popup.component.scss']
})
export class OpenmobilePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OpenmobilePopupComponent>,
  ) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close()
  }
}
