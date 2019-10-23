import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material';
import { SubscriptionService } from '../../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
@Component({
  selector: 'app-delete-subscription',
  templateUrl: './delete-subscription.component.html',
  styleUrls: ['./delete-subscription.component.scss']
})
export class DeleteSubscriptionComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<DeleteSubscriptionComponent>,@Inject(MAT_DIALOG_DATA) public fragmentData: any ,private subscription:SubscriptionService,public eventService:EventService) { }
  ngOnInit() {
    console.log("fragmentData",this.fragmentData);
  }
  cancelSubscription()
  {
    let obj={
      advisorId:12345,
      id:18
    }
    this.subscription.cancelSubscriptionData(obj).subscribe(
      data => this.canceledData(data)
    )
  }
  dialogClose() {
    this.dialogRef.close();
  }
  canceledData(data)  
  {
    console.log("data:",data);
    if(data == true){
      this.eventService.openSnackBar("Cancelled successfully!","dismiss")
      this.dialogClose();
    }
  }
}
