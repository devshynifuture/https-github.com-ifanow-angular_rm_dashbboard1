import { EventService } from './../../../../../../Data-service/event.service';
import { SubscriptionService } from './../../../Subscriptions/subscription.service';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    public subscription: SubscriptionService,
    public eventService: EventService) { }

  receipentEmail: string;
  subject: string;
  emailBody: string;
  doc: [];
  docObj: [];
  data;

  // @Input() set data(data) {
  //   this._data = data;
  // }

  // get data() {
  //   return this._data;
  // }

  ngOnInit() {
    console.log("this is data sent from draft list ->>>>  ", this.data);
  }


  Close(state) {
    this.subInjectService.rightSliderData(state);
  }

  // sendEmail() {
  //   const emailRequestData = {
  //     body: this.emailBody,
  //     subject: this.subject,
  //     fromEmail: this.emailData.fromEmail,
  //     toEmail: [{ emailId: this._inputData.clientData.userEmailId, sendType: 'to' }],
  //     documentList: this._inputData.documentList
  //   };
  //   console.log('send email complete JSON : ', JSON.stringify(emailRequestData));
  // }

  close() {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

    // this.valueChange.emit(this.emailSend);
  }

}
