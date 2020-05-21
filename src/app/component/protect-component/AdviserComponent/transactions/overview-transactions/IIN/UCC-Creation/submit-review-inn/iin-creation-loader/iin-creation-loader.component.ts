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

  constructor(public dialogRef: MatDialogRef<IinCreationLoaderComponent>,
              @Inject(MAT_DIALOG_DATA) public fragmentData: any, private onlineTransact: OnlineTransactionService,
              public eventService: EventService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    console.log('fragmentData', this.fragmentData);
  }

  cancelSubscription(state) {
    this.onlineTransact.createIINUCC(this.fragmentData.requestJson).subscribe(
      data => this.createIINUCCRes(data, this.fragmentData.singleBrokerCred), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  setSuccessData(data) {
    console.log('data respose iin creation loader =', data);
  }

  createIINUCCRes(data, singleBrokerCred) {
    console.log('data respose =', data);
    singleBrokerCred.tpUserRequestId = data.id;
    singleBrokerCred.tpUserRequest = data;
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
