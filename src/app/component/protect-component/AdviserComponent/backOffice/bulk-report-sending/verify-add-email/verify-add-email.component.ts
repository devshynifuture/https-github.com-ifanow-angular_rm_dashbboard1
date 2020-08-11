import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { AuthService } from 'src/app/auth-service/authService';
import { AlertTitleComponent } from '../alert-title/alert-title.component';

@Component({
  selector: 'app-verify-add-email',
  templateUrl: './verify-add-email.component.html',
  styleUrls: ['./verify-add-email.component.scss']
})
export class VerifyAddEmailComponent implements OnInit {

  dataCount: number;
  displayedColumns: string[] = ['checkbox', 'no', 'ownerName'];
  bankList: any;
  popUP: any;
  email: any;
  emailVierify: FormGroup;
  emailDetails: any;
  element: any;
  advisorId: any;
  constructor(public dialogRef: MatDialogRef<VerifyAddEmailComponent>, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
      this.advisorId = AuthService.getAdvisorId()
    }


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
      emailId: [(!data) ? '' : data.emailId, [Validators.required, Validators.pattern(ValidatorType.EMAIL)]],
    });
  }

  getFormControl(): any {
    return this.emailVierify.controls;
  }
  saveEmail(email) {
    this.email = email
  }
  onNoClick(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(AlertTitleComponent, {
      width: '400px',
      data: { bank: '', animal: this.element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      this.element = result;
      let obj = {
        id: this.element.id,
        emailAddress: this.element.emailAddress,
        userId: this.advisorId
      }
      //  this.bankDetailsSend.emit(result);
    });
  }

}
