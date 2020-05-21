import {Component, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Inject} from '@angular/core/src/metadata/*';
import {EventService} from '../../../../../../../../../Data-service/event.service';
import {AuthService} from '../../../../../../../../../auth-service/authService';
import {OnlineTransactionService} from '../../../../../online-transaction.service';

@Component({
  selector: 'app-iin-creation-loader',
  templateUrl: './iin-creation-loader.component.html',
  styleUrls: ['./iin-creation-loader.component.scss']
})
export class IinCreationLoaderComponent implements OnInit {

  advisorId;
  showNextMessage = false;

  constructor(public dialogRef: MatDialogRef<IinCreationLoaderComponent>,
              @Inject(MAT_DIALOG_DATA) public fragmentData: any, private onlineTransact: OnlineTransactionService,
              public eventService: EventService) {
  }

  emailId = '';
  isLoading = true;
  platformName = 'BSE Star MF';

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
}
