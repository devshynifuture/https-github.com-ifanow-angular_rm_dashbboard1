import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
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
  fragmentData: any;

  constructor(private eventService: EventService, public subService: SubscriptionService,public dialog: MatDialog) {

  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
  }
  get data() {
    return this.fragmentData;
  }

  set data(data) {
    console.log('SubscriptionUpperSliderComponent data : ', data);
    this.fragmentData = { data };
    this.heading = (this.fragmentData.data.id == 1) ? 'Invoice' : (this.fragmentData.data.id == 2) ? 'Quotations' : (this.fragmentData.data.id == 3) ? ' Documents with eSign request' : ' Documents without eSign request';
    this.storeData = this.fragmentData.data;
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

  // dialogClose() {
  //   this.dialogRef.close();
  // }
  dialogClose() {
    this.eventService.changeUpperSliderState({ state: 'close' });
    // this.dialogRef.close();
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
