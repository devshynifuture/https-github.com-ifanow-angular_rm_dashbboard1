import { EmailUtilService } from './../../../../../../services/email-util.service';
import { FormBuilder, FormGroup, Form } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { SubscriptionService } from './../../../Subscriptions/subscription.service';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { EmailServiceService } from './../../email-service.service';
import { EventService } from './../../../../../../Data-service/event.service';
import { Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit, OnDestroy {

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
  data = null;
  isCcSelected: boolean = false;
  isBccSelected: boolean = false;
  isFromChanged: boolean = false;
  idArray: [] = [];
  prevStateOfForm;
  currentStateOfForm: Form;
  toCreateOrUpdate: string = '';
  emailFormChangeSubscription: Subscription;
  didFormChanged: boolean = false;
  emailForm: FormGroup;
  cc: string = '';
  bcc: string = '';

  subjectObs = new Subject<any>();

  ngOnInit() {
    this.createEmailForm();
    this.prevStateOfForm = this.emailForm.value;

    this.emailForm.valueChanges.subscribe(res => {
      if(!this.areTwoObjectsEquivalent(this.prevStateOfForm, res)){
        this.autoSaveDraft(res);
        this.prevStateOfForm = res;
      }
    });
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
        if (element.name === "Cc") {
          this.cc = element.value.split('<')[1].split('>')[0];
          this.isCcSelected = true;
        }
        if (element.name === "Bcc") {
          this.bcc = element.value.split('<')[1].split('>')[0];
          this.isBccSelected = true;
        }
      });
      this.emailForm.setValue({
        sender: this.from ? this.from : '',
        receiver: this.to ? this.to : '',
        carbonCopy: this.cc ? this.cc : '',
        blindCarbonCopy: this.bcc ? this.bcc : '',
        subject: this.subject ? this.subject : '',
        messageBody: this.emailBody ? this.emailBody : '',
        attachments: ['']
      });
    }
  }
  
  areTwoObjectsEquivalent(a: {}, b: {}): boolean {

    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
  }

  autoSaveDraft(res){
    
    console.log("auto saved");
    
    // setTimeout(()=>{ 
    //   console.log("auto save");
    // }, 4000);
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
    if ((!this.data && this.data === null) && this.didFormChanged) {
      // call create api from compose

      let Obj = {
        to: '',
        from: '',
        emailBody: '',
        attachments: '',
        subject: ''
      }
      this.emailService.createDraft(Obj)
        .subscribe(response => console.log(response), error => console.error(error));
      console.log("created");
      console.log("call create api from compose");
    } else if ((this.data && this.data !== null) && this.didFormChanged) {
      // call update api
      console.log("call update api from detail view");
    } else if ((this.data && this.data !== null) && !this.didFormChanged) {
      // close the dialog
      console.log("close the dialog");
    }
    // let Obj;
    // if (this.toCreateOrUpdate === 'create') {
    //   Obj = {
    //     to: '',
    //     from: '',
    //     emailBody: '',
    //     attachments: '',
    //     subject: ''
    //   }
    //   this.emailService.createDraft(Obj)
    //     .subscribe(response => console.log(response), error => console.error(error));
    //   console.log("created");
    // } else if (this.toCreateOrUpdate === 'update') {
    //   Obj = {
    //     to: this.to,
    //     from: this.from,
    //     emailBody: this.emailBody,
    //     attachments: '',
    //     subject: this.subject,
    //   }
    //   this.emailService.updateDraft(Obj)
    //     .subscribe(response => console.log(response), error => console.error(error));

    //   console.log("updated");
    // } else {
    //   this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    //   this.subInjectService.changeNewRightSliderState({ state: 'close' });
    //   console.log("closed...");
    // }

    // this.valueChange.emit(this.emailSend);
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
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
    let encodedSubject = EmailUtilService.changeStringToBase64(subject);
    let encodedMessage = EmailUtilService.changeStringToBase64(bodyMessage);
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

  ngOnDestroy(): void {
    if (this.emailFormChangeSubscription) {
      this.emailFormChangeSubscription.unsubscribe();
    }
  }
}
