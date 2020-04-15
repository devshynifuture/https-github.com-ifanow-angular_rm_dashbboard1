import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../../Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-open-email-verification',
  templateUrl: './open-email-verification.component.html',
  styleUrls: ['./open-email-verification.component.scss']
})
export class OpenEmailVerificationComponent implements OnInit {

  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
  bankList: any;
  popUP: any;
  email: any;
  emailVierify: any;
  emailDetails: any;
  constructor(public dialogRef: MatDialogRef<OpenEmailVerificationComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  isLoading = false
  dataS = []
  ngOnInit() {
    this.getdataForm('')
    const ELEMENT_DATA = this.dataS;
    this.emailDetails = this.data.bank;
    this.emailVierify.controls.emailId.setValue(this.emailDetails.emailAddress)
    ELEMENT_DATA.forEach(item => item.selected = false);
  }
  getdataForm(data) {
    this.emailVierify = this.fb.group({
      emailId: [(!data) ? '' : data.emailId, [Validators.required]],
    });
  }

  getFormControl(): any {
    return this.emailVierify.controls;
  }
  saveEmail(email) {
    this.email = email
  }
  onNoClick(): void {
    let obj = {
      emailAddress : this.emailVierify.controls.emailId.value,
      id : this.emailDetails.id
    }
    if(obj.emailAddress == undefined){
      obj = undefined
    }
    this.dialogRef.close(obj);
  }

}
