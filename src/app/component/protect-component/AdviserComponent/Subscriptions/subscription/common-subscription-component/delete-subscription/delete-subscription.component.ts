import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-delete-subscription',
  templateUrl: './delete-subscription.component.html',
  styleUrls: ['./delete-subscription.component.scss']
})
export class DeleteSubscriptionComponent implements OnInit {

  advisorId;
  constructor(public dialogRef: MatDialogRef<DeleteSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public fragmentData: any, private subscription: SubscriptionService,
    public eventService: EventService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    console.log('fragmentData', this.fragmentData);
  }

  cancelSubscription(state) {
    let obj;
    if (state == 'immediately') {
      obj = {
        // advisorId: 12345,
        advisorId: this.advisorId,
        id: this.fragmentData.subData.id
      };
    }
    else {
      obj = {
        "id": this.fragmentData.subData.id,
        "advisorId": this.advisorId,
        "cancellationDate": this.fragmentData.subData.nextBillingDate
      }
    }

    this.subscription.cancelSubscriptionData(obj).subscribe(
      data => this.canceledData(data)
    );
  }

  dialogClose() {
    this.dialogRef.close();
  }

  canceledData(data) {
    console.log('data:', data);
    if (data == true) {
      this.eventService.openSnackBar('Cancelled successfully!', 'dismiss');
      this.dialogRef.close(data);

    }
  }
}
