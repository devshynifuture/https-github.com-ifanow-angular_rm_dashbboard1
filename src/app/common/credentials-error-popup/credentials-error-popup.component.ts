import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-credentials-error-popup',
  templateUrl: './credentials-error-popup.component.html',
  styleUrls: ['./credentials-error-popup.component.scss']
})
export class CredentialsErrorPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CredentialsErrorPopupComponent>,
    private router: Router) { }

  ngOnInit() {
  }

  updateSetting() {
    this.router.navigate(['/admin/transactions/settings/manage-credentials/arn-ria-creds'])
    this.close(false);
  }

  close(flag) {
    flag ? AuthService.setInvalidCredsTimeZone(new Date().getTime()) : ''
    this.dialogRef.close()
  }

}
