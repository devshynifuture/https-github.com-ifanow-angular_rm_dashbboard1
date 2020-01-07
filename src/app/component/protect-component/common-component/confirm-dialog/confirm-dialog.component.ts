import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SubscriptionService} from '../../AdviserComponent/Subscriptions/subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from 'src/app/auth-service/authService';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  headerData: any;
  bodyData: any;
  bodyData2: any;
  btn1NoData: any;
  btn2YesData: any;
  data: any;
  @Input()
  public positiveMethod: Function;
  @Input()
  public negativeMethod: Function;
  dataToshow: any;
  advisorId;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any, private subscription: SubscriptionService,
              public eventService: EventService) {
    this.dataToshow = dialogData.dataToShow;
  }

  ngOnInit() {
    console.log(this.dialogData, 'invoice deleted successfully.');
    this.headerData = this.dialogData.header;
    this.bodyData = this.dialogData.body;
    this.bodyData2 = this.dialogData.body2;
    this.btn1NoData = this.dialogData.btnNo;
    this.btn2YesData = this.dialogData.btnYes;
    this.data = this.dialogData.data;
    this.advisorId = AuthService.getAdvisorId();

  }

  clickButton2() {
    console.log('invoice deleted successfully.', this.dialogData);
    
    if(this.dialogData.dataToShow != undefined){
      let list = [this.dialogData.dataToShow];
      this.subscription.deleteInvoices(list).subscribe((data)=>{
        this.dialogRef.close('close');
        this.eventService.openSnackBar('invoice deleted successfully.', 'dismiss');
      },
      err => this.eventService.openSnackBar(err));
    }
    if (this.dialogData.positiveMethod() != undefined) {
      this.dialogData.positiveMethod();
    } else {
      console.log('positive not defined 11111111111111111111111111111111111111111111');

    }
  }

  clickButton1() {
    if (this.dialogData.negativeMethod) {
      this.dialogData.negativeMethod();
      this.dialogClose();
    } else {
      console.log('negative not defined 11111111111111111111111111111111111111111111');

    }
  }

  dialogClose() {
    this.dialogRef.close();
  }

  deleteSubscription() {

    if (this.dialogData.positiveMethod) {
      this.dialogData.positiveMethod();
    } else {
      console.log('positive not defined 11111111111111111111111111111111111111111111');

    }
  }

  deletedData(data) {
    if (data == true) {
      this.dialogRef.close();
      this.eventService.changeUpperSliderState({state: 'close'});
      this.eventService.openSnackBar('Deleted successfully!', 'dismiss');
    }
  }
}
