import { EventService } from './../../../../../../../Data-service/event.service';
import { SubscriptionService } from './../../../../Subscriptions/subscription.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-add-task',
  templateUrl: './email-add-task.component.html',
  styleUrls: ['./email-add-task.component.scss']
})
export class EmailAddTaskComponent implements OnInit {
  subject;
  emailBody;
  receipentEmail;
  senderEmail;
  constructor(private subInjectService: SubscriptionInject,
    public subscription: SubscriptionService,
    public eventService: EventService) { }

  ngOnInit() {
  }

  Close(state) {
    this.subInjectService.rightSliderData(state);
  }

  sendEmail() {
    // const emailRequestData = {
    //   body: this.emailBody,
    //   subject: this.subject,
    //   fromEmail: this.emailData.fromEmail,
    //   toEmail: [{ emailId: this._inputData.clientData.userEmailId, sendType: 'to' }],
    //   documentList: this._inputData.documentList
    // };

  }

  close() {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

    // this.valueChange.emit(this.emailSend);
  }
  saveData(data) {

  }
}
