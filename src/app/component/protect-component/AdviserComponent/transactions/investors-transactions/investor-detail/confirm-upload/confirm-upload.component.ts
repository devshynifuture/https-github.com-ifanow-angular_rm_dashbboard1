import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionService } from '../../../../Subscriptions/subscription.service';

@Component({
  selector: 'app-confirm-upload',
  templateUrl: './confirm-upload.component.html',
  styleUrls: ['./confirm-upload.component.scss']
})


export class ConfirmUploadComponent implements OnInit {
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


  constructor(public dialogRef: MatDialogRef<ConfirmUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any, private subscription: SubscriptionService,
    public eventService: EventService) {
    this.dataToshow = dialogData.dataToShow;
  }

  ngOnInit() {
    this.headerData = this.dialogData.header;
    this.bodyData = this.dialogData.body;
    this.bodyData2 = this.dialogData.body2;
    this.btn1NoData = this.dialogData.btnNo;
    this.btn2YesData = this.dialogData.btnYes;
    this.data = this.dialogData.data;

  }

  clickButton2(fileData) {
    this.dialogRef.close(fileData);
  }

  clickButton1() {
    if (this.dialogData.negativeMethod) {
      this.dialogData.negativeMethod();
      this.dialogClose();
    } else {

    }
  }

  dialogClose() {
    this.dialogRef.close();
  }

  deletedData(data) {
  }
}

