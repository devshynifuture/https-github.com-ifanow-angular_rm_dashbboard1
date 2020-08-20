import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SubscriptionService} from '../../AdviserComponent/Subscriptions/subscription.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatProgressButtonOptions} from 'src/app/common/delete-progress-button/delete-progress-button.component';

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

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'DELETE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
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
    this.barButtonOptions.text = this.btn1NoData
    // this.advisorId = AuthService.getAdvisorId();

  }

  clickButton2() {
    this.barButtonOptions.active = true;

    if (this.dialogData.dataToShow != undefined) {
      let list = [this.dialogData.dataToShow];
      this.subscription.deleteInvoices(list).subscribe((data) => {
        this.dialogRef.close('close');
        this.eventService.openSnackBar('invoice deleted successfully.', 'Dismiss');
      },
        error => this.eventService.showErrorMessage(error));
    }
    if (this.dialogData.positiveMethod() != undefined) {
      this.dialogData.positiveMethod();
    } else {

    }
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

  deleteSubscription() {

    if (this.dialogData.positiveMethod) {
      this.dialogData.positiveMethod();
    } else {

    }
  }

  deletedData(data) {
    if (data == true) {
      this.dialogRef.close();
      this.eventService.changeUpperSliderState({ state: 'close' });
      this.eventService.openSnackBar('Deleted successfully!', 'Dismiss');
    }
  }
}
