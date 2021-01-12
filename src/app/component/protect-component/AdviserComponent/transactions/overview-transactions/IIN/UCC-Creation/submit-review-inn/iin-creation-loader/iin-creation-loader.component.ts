import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core/src/metadata/*';
import { EventService } from '../../../../../../../../../Data-service/event.service';
import { AuthService } from '../../../../../../../../../auth-service/authService';
import { OnlineTransactionService } from '../../../../../online-transaction.service';

@Component({
  selector: 'app-iin-creation-loader',
  templateUrl: './iin-creation-loader.component.html',
  styleUrls: ['./iin-creation-loader.component.scss']
})
export class IinCreationLoaderComponent implements OnInit {

  advisorId;
  showNextMessage = false;
  msg: any;
  numb: any;

  constructor(public dialogRef: MatDialogRef<IinCreationLoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public fragmentData: any, private onlineTransact: OnlineTransactionService,
    public eventService: EventService) {
  }

  emailId = '';
  isLoading = true;
  platformName = 'BSE Star MF';
  failureMessage;
  isSuccess = true;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    console.log('fragmentData', this.fragmentData);
    this.emailId = this.fragmentData.requestJson.holderList[0].email;
    this.platformName = this.fragmentData.singleBrokerCred.aggregatorType == 1 ?
      'NSE NMF II' : 'BSE Star MF';
  }

  setSuccessData(data) {
    this.isLoading = false;
    console.log('data respose iin creation loader =', data);
  }

  setFailureData(message) {
    this.isSuccess = false;
    this.failureMessage = message;
    this.msg = this.failureMessage.includes('MAPPED WITH SOME OTHER BROKER');
    var numb = this.failureMessage.match(/\d/g);
    this.numb = parseInt(numb.join(""));
    console.log(this.numb)
  }

  showMessageAfterProceed() {
    this.showNextMessage = true;
  }

  dialogClose() {
    this.dialogRef.close();
  }

  canceledData(data) {
    console.log('data:', data);
    if (data == true) {
      this.eventService.openSnackBar('Cancelled successfully!', 'Dismiss');
      this.dialogRef.close(data);
    }
  }
  mappUser() {
    let obj = {
      tpUserCredentialId: this.fragmentData.singleBrokerCred.tpUserCredentialId,
      clientCode: this.numb,
      familyMemberId: (this.fragmentData.requestJson.familyMemberId) ? this.fragmentData.requestJson.familyMemberId : 0,
      clientId: this.fragmentData.requestJson.clientId
    }
    console.log('obj')
    this.onlineTransact.mappedExistingUser('')
      .subscribe(res => {
        if (res) {
          console.log('mappedUser', res)
          this.eventService.openSnackBar("Mapped exsting user Successfully", "Dismiss");
        } else {
          this.eventService.openSnackBar("Mapped exsting user Unsuccessful", "Dismiss");
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      })
  }
}
