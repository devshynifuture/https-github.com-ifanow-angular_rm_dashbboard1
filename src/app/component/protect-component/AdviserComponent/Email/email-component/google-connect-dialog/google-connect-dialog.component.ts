import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../../../customers/component/common-component/document-new-folder/document-new-folder.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../../auth-service/authService';
import { EventService } from '../../../../../../Data-service/event.service';

@Component({
  selector: 'app-google-connect-dialog',
  templateUrl: './google-connect-dialog.component.html',
  styleUrls: ['./google-connect-dialog.component.scss']
})
export class GoogleConnectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GoogleConnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService
  ) { }

  redirectForm = this.fb.group({
    googleConnectEmail: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    if (!(localStorage.getItem('googleOAuthToken') && localStorage.getItem('successStoringToken') && localStorage.getItem('associatedGoogleEmailId'))) {
      localStorage.removeItem('googleOAuthToken');
      localStorage.removeItem('successStoringToken');
      localStorage.removeItem('associatedGoogleEmailId');
    } else {
      this.router.navigate(['/admin/emails/inbox'], { relativeTo: this.activatedRoute })
    }
  }


  gmailRedirectUrlCreation() {
    const hitGmailUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=579886643607-h1m21go2dct12nva48pi5mr7meejv7nh.apps.googleusercontent.com&response_type=code&scope=https://mail.google.com+https://www.googleapis.com/auth/calendar&redirect_uri=http://localhost:4200/redirect&access_type=offline';

    localStorage.removeItem('associatedGoogleEmailId');
    // compare it with authEmail id
    if (AuthService.getUserInfo().userName == this.redirectForm.get('googleConnectEmail').value) {
      localStorage.setItem('associatedGoogleEmailId', this.redirectForm.get('googleConnectEmail').value)
      const redirectWindow = window.open(hitGmailUrl);
      const lookForSuccessToken = setInterval(() => {
        if (localStorage.getItem('successStoringToken') === 'true') {
          clearInterval(lookForSuccessToken);
          redirectWindow.close();
          this.onNoClick();
          this.router.navigate(['/admin/emails/inbox'], { relativeTo: this.activatedRoute });
        }
      }, 1000);
    } else {
      this.eventService.openSnackBar("Your email id is not same as your login credentials", "Dismiss")
    }


    // setTimeout(() => {
    //   redirectWindow.close();
    //   console.log("tis is something to work with");
    //   if (localStorage.getItem('successStoringToken') === 'true') {
    //     this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    //   }
    // }, 25000);

  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.redirectForm.get('googleConnectEmail').valid) {

    }
  }
}
