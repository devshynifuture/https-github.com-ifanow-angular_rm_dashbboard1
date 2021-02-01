import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-open-domain-white-label-popup',
  templateUrl: './open-domain-white-label-popup.component.html',
  styleUrls: ['./open-domain-white-label-popup.component.scss']
})
export class OpenDomainWhiteLabelPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OpenDomainWhiteLabelPopupComponent>, ) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close()
  }
}
