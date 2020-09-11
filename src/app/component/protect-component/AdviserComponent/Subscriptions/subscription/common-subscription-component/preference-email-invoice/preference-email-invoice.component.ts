import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EventService } from '../../../../../../../Data-service/event.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { HowToUseDialogComponent } from '../how-to-use-dialog/how-to-use-dialog.component';
import { AuthService } from "../../../../../../../auth-service/authService";
import { SubscriptionInject } from '../../../subscription-inject.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-preference-email-invoice',
  templateUrl: './preference-email-invoice.component.html',
  styleUrls: ['./preference-email-invoice.component.scss']
})
export class PreferenceEmailInvoiceComponent implements OnInit {
  model: any;
  storeData: any;
  logoText = '';
  advisorId;
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
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
  mailForm = new FormGroup({
    mail_body: new FormControl(''),

  });
  heading: string;
  fragmentData: any;
  popupHeaderText;
  constructor(private eventService: EventService, public authService: AuthService,
    public subService: SubscriptionService, public dialog: MatDialog, private render: Renderer2,
    private subInjectService: SubscriptionInject) {

  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
  }

  get data() {
    return this.fragmentData;
  }

  set data(data) {
    this.fragmentData = { data };
    this.popupHeaderText = data.title;
    this.heading = (this.fragmentData.data.id == 1) ? 'Invoice' : (this.fragmentData.data.id == 2) ? 'Quotations' : (this.fragmentData.data.id == 3) ? ' Documents with esign request' : ' Documents without eSign request';
    this.storeData = this.fragmentData.data;
  }

  copyName(value) {
    const tag = this.render.createElement('input');
    tag.value = value;
    document.body.appendChild(tag);
    tag.focus();
    tag.select();
    document.execCommand('copy');
    document.body.removeChild(tag);
    this.eventService.openSnackBar('Text copied', 'Dismiss');
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

  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


  saveData(data) {
    // this.storeData.documentText=data;
  }

  save() {
    this.updateData(this.storeData);
  }

  updateData(data) {
    this.barButtonOptions.active = true;
    const obj = {
      subject: data.subject,
      body: data.body,
      advisorId: this.advisorId,

      // "advisorId":2727,
      emailTemplateId: this.storeData.emailTemplateId
    };
    this.subService.updateEmailTemplate(obj).subscribe(
      data => this.getResponseData(data),
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
        this.barButtonOptions.active = false;
      }
    );
  }

  getResponseData(data) {
    this.barButtonOptions.active = false;
    this.eventService.openSnackBar("Updated sucessfully", "Dimiss")
    this.close(true)
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
