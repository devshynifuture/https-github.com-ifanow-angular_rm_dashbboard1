import { EmailUtilService } from './../../../../../../services/email-util.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  from: string = "";
  to: string = "";
  idOfMessage;
  date;
  doc: [];
  docObj: [];
  message: string;
  data;
  isCcSelected: boolean = false;
  isBccSelected: boolean = false;
  isFromChanged: boolean = false;
  idArray: [] = [];

  emailForm: FormGroup;

  ngOnInit() {
    this.createEmailForm();
  }

  createEmailForm() {
    // console.log("this is data sent from draft list ->>>>  ", this.data);
    this.emailForm = this.fb.group({
      sender: ['', Validators.email],
      receiver: ['', Validators.email],
      carbonCopy: ['', Validators.email],
      blindCarbonCopy: ['', Validators.email],
      subject: [''],
      messageBody: [''],
      attachments: [''],
    });

    if (this.data) {
      console.log("hello this is data ->>>>>>>>>>>>>>>", this.data);
      const { dataObj, idArray } = this.data;
      const { idsOfThread: { id } } = dataObj;
      this.idOfMessage = id;

      this.idArray = idArray;
      const { subjectMessage: { subject, message } } = dataObj;
      const { date } = dataObj;
      this.date = date;
      this.subject = subject;
      this.emailBody = message;
      const { parsedData: { headers } } = dataObj;
      headers.forEach(element => {
        if (element.name === "From") {
          this.from = element.value.split('<')[1].split('>')[0];
        }
        if (element.name === "To") {
          this.to = element.value.split('<')[1].split('>')[0];
        }
      });
    }
  }

  toggleCC(): void {
    this.isCcSelected = !this.isCcSelected;
    this.emailForm.get('carbonCopy').setValue("");
  }

  toggleBCC(): void {
    this.isBccSelected = !this.isBccSelected;
    this.emailForm.get('blindCarbonCopy').setValue("");
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

  close(): void {
    this.idArray.forEach(element => {
      if (element !== this.idOfMessage) {
        const Obj = {
          to: this.to ? this.to : '',
          from: this.from ? this.from : '',
          emailBody: this.emailBody ? this.emailBody : '',
          attachments: '',
          subject: this.subject ? this.subject : ''
        }
        this.emailService.createDraft(Obj)
          .subscribe(response => console.log(response), error => console.error(error));
      } else if (element !== this.idOfMessage) {

        const Obj = {
          id: this.idOfMessage,
          to: this.to ? this.to : '',
          from: this.from ? this.from : '',
          emailBody: this.emailBody ? this.emailBody : '',
          attachments: '',
          subject: this.subject ? this.subject : ''
        }
        console.log(" update api for draft");
        this.emailService.updateDraft(Obj)
          .subscribe(response => console.log(response), error => console.error(error))
      }
    });

    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
    // this.valueChange.emit(this.emailSend);
  }

  onSendEmail(): void {
    console.log(this.emailForm.value);
  }

  handleCloseMail() {

  }

  sendMail(): void {
    console.log('send mail');
    this.handleCloseMail();
  }

  saveData(event): void {
    this.emailForm.get('messageBody').setValue(event);
  }

  createUpdateDraft(id: string, toAddress: Array<any>, subject: string, bodyMessage: string, fileData: Array<any>) {
    let encodedSubject = EmailUtilService.changeStringToBase46(subject);
    let encodedMessage = EmailUtilService.changeStringToBase46(bodyMessage);
    const requestJson = {
      id,
      toAddress,
      subject: encodedSubject,
      message: encodedMessage,
      fileData
    };

    console.log('LeftSidebarComponent createUpdateDraft requestJson : ', requestJson);
    const createUpdateDraftSubscription = this.emailService.createUpdateDraft(requestJson)
      .subscribe((responseJson) => {
        console.log(requestJson);
        console.log("+++++++++++++++");
        console.log(responseJson);
        createUpdateDraftSubscription.unsubscribe();
      }, (error) => {
        console.error(error);
      });
  }

  getFileDetails(e) {
    console.log('LeftSidebarComponent getFileDetails e : ', e.target.files[0]);
    const singleFile = e.target.files[0];

    const fileData = [];

    EmailUtilService.getBase64FromFile(singleFile, (successData) => {
      fileData.push({
        filename: singleFile.name,
        size: singleFile.size,
        mimeType: singleFile.type,
        data: successData
      });
      this.createUpdateDraft(null, ['gaurav@futurewise.co.in'],
        'This is a test message', 'This is a test message body', fileData);
    });

  }
}
