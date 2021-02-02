import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification-popup',
  templateUrl: './email-verification-popup.component.html',
  styleUrls: ['./email-verification-popup.component.scss']
})
export class EmailVerificationPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmailVerificationPopupComponent>,
    public router: Router, ) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close()
  }
  redirect() {
    this.dialogRef.close('data')
    this.router.navigate(['admin', 'setting', 'preference']);
  }
}
