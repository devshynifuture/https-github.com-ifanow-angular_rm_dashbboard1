import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {EventService} from '../../../../../../../Data-service/event.service';
import {FormControl, FormGroup} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {HowToUseDialogComponent} from '../how-to-use-dialog/how-to-use-dialog.component';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-preference-email-invoice',
  templateUrl: './preference-email-invoice.component.html',
  styleUrls: ['./preference-email-invoice.component.scss']
})
export class PreferenceEmailInvoiceComponent implements OnInit {
  model: any;
  storeData: any;

  advisorId;

  mailForm = new FormGroup({
    mail_body: new FormControl(''),

  });
  heading: string;

  constructor(private eventService: EventService, public subService: SubscriptionService, public dialogRef: MatDialogRef<PreferenceEmailInvoiceComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public fragmentData: any) {
    console.log('ModifyFeeDialogComponent constructor: ', this.fragmentData);
    this.heading = (this.fragmentData.flag.id == 1) ? 'Invoice' : (this.fragmentData.flag.id == 2) ? 'Quotations' : (this.fragmentData.flag.id == 3) ? ' Documents with eSign request' : ' Documents without eSign request';
    this.storeData = this.fragmentData.flag;
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
  }

// Begin ControlValueAccesor methods.
  onChange = (_) => {
  }
  onTouched = () => {
  }

// Form model content changed.
  writeValue(content: any): void {
    this.model = content;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  dialogClose() {
    this.dialogRef.close();
  }

  saveData(data) {
    console.log(data);
    // this.storeData.documentText=data;
  }

  save() {
    console.log('here is saved data', this.storeData);
    this.updateData(this.storeData);
    this.dialogClose();
  }

  updateData(data) {
    console.log(data);
    const obj = {
      subject: data.subject,
      body: data.body,
      advisorId: this.advisorId,

      // "advisorId":2727,
      emailTemplateId: 1
    };
    this.subService.updateEmailTemplate(obj).subscribe(
      data => this.getResponseData(data)
    );
  }

  getResponseData(data) {
    console.log('getResponse', data);
  }

  openDialog(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(HowToUseDialogComponent, {
      width: '30%',
      data: Fragmentdata,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
