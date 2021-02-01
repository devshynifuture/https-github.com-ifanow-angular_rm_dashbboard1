import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-email-verification-popup',
  templateUrl: './email-verification-popup.component.html',
  styleUrls: ['./email-verification-popup.component.scss']
})
export class EmailVerificationPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmailVerificationPopupComponent>, ) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close()
  }
}
