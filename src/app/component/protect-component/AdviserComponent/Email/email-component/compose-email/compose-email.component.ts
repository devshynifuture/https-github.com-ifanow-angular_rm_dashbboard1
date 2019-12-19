import { FormBuilder, FormGroup, FormArray, Form } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { SubscriptionService } from './../../../Subscriptions/subscription.service';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { EmailServiceService } from './../../email-service.service';
import { EventService } from './../../../../../../Data-service/event.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject,
    public subscription: SubscriptionService,
    public eventService: EventService,
    private emailService: EmailServiceService,
    private fb: FormBuilder) { }

  receipentEmail: string;
  subject: string;
  emailBody: string = '';
  from;
  to;
  date;
  doc: [];
  docObj: [];
  message;
  data;
  isCcSelected: boolean = false;
  isBccSelected: boolean = false;

  emailForm: FormGroup;

  createDraft() {
    // this.emailService.createUpdateDraft()
    //   .subscribe(response => console.log(response),
    //     error => console.error(error));
  }

  // @Input() set data(data) {
  //   this._data = data;
  // }

  // get data() {
  //   return this._data;
  // }

  ngOnInit() {
    // console.log("this is data sent from draft list ->>>>  ", this.data);
    this.emailForm = this.fb.group({
      receiver: ['', Validators.email],
      sender: ['', Validators.email],
      subject: [''],
      messageBody: [''],
      attachments: [''],
      carbonCopy: ['', Validators.email],
      blindCarbonCopy: ['', Validators.email]
    });

    if (this.data !== undefined && this.data !== null) {
      const { subjectMessage: { subject, message } } = this.data;
      const { date } = this.data;
      this.date = date;
      this.subject = subject;
      this.message = message;
      const { parsedData: { headers } } = this.data;
      headers.forEach(element => {
        if (element.name === "From") {
          this.from = element.value.split('<')[1].split('>')[0];
        }
        if (element.name === "To") {
          this.to = element.value.split('<')[1].split('>')[0];
        }
      });
    }


    //   const { subject, message, date, headers } = this.data;
    //   const [, , , , fromObj, toObj] = headers;
    //   const from = fromObj['value'];
    //   const to = toObj['value'];

    //   this.subject = subject;
    //   this.message = message;
    //   this.date = date;
    //   this.from = from;
    //   this.to = to.split('<')[1].split('>')[0];

    // }
  }

  toggleCC() {
    this.isCcSelected = !this.isCcSelected;
    this.emailForm.get('carbonCopy').setValue("");
  }

  toggleBCC() {
    this.isBccSelected = !this.isBccSelected;
    this.emailForm.get('blindCarbonCopy').setValue("");
  }

  // onCreateDraft() {
  //   this.emailService.createUpdateDraft(this.body)
  //     .subscribe(response => console.log('draft creation response ->>>>>', response),
  //       error => console.error('error', error));
  // }

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
    if (this.from !== '' && this.from !== null) {
      const Obj = {
        to: this.to ? this.to : '',
        from: this.from ? this.from : '',
        emailBody: this.emailBody ? this.emailBody : '',
        attachments: '',
        subject: this.subject ? this.subject : ''
      }
      this.emailService.createDraft(Obj)
        .subscribe(response => console.log(response), error => console.log(error));
    }
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
    // this.valueChange.emit(this.emailSend);
  }

  onSendEmail() {
    console.log(this.emailForm.value);
  }

  handleCloseMail() {

  }

  sendMail() {
    console.log('send mail');
    this.checkEmptyFields();
    this.handleCloseMail();
  }

  checkEmptyFields() {
    // validity errors append;
  }

  saveData(event) {
    this.emailForm.get('messageBody').setValue(event);
  }
}
