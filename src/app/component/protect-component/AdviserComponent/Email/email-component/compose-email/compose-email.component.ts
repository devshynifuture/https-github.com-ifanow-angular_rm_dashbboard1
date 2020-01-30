import { AuthService } from './../../../../../../auth-service/authService';
import { EmailUtilService } from './../../../../../../services/email-util.service';
import { FormBuilder, FormGroup, Form } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { SubscriptionService } from './../../../Subscriptions/subscription.service';
import { SubscriptionInject } from './../../../Subscriptions/subscription-inject.service';
import { EmailServiceService } from './../../email-service.service';
import { EventService } from './../../../../../../Data-service/event.service';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { EmailAttachmentI } from '../email.interface';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit, OnDestroy {
  attachmentsIdArray: { filename: string, mimeType: string, attachmentId: string }[] = [];
  attachmentsBase64Data: { filename: string, size: number, attachmentBase64Data: string, mimeType: string }[] = [];
  attachmentArrayDetail: { filename: string, size: number, mimeType: string, data: string, downloadUrl: string }[] = [];

  constructor(private subInjectService: SubscriptionInject,
    public subscription: SubscriptionService,
    public eventService: EventService,
    private emailService: EmailServiceService,
    private fb: FormBuilder) { }

  receipentEmail: string;
  subject: string;
  emailBody: string = '';
  from: string = AuthService.getUserInfo().emailId;
  to: string = "";
  idOfMessage = null;
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
  ccArray: string[] = [];
  bccArray: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  receipients: string[] = [];
  attachmentIdsArray: string[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  interval;
  emailFormValueChange;
  emailAttachments: EmailAttachmentI[] = [];

  ngOnInit() {
    this.createEmailForm();
    if (this.idOfMessage) {
      // this.messageDetailApi(this.idOfMessage);
    }
    this.prevStateOfForm = this.emailForm.value;
    this.emailForm.valueChanges.subscribe(res => this.emailFormValueChange = res);

    this.interval = setInterval(() => {
      if (!this.areTwoObjectsEquivalent(this.prevStateOfForm, this.emailFormValueChange)) {
        console.log("auto saved!!");
        // call update or create draft api
        const requestJson = {
          toAddress: this.emailForm.get('receiver').value ? this.emailForm.get('receiver').value : [''],
          subject: this.emailForm.get('subject').value ? this.emailForm.get('subject').value : '',
          message: this.emailForm.get('messageBody').value ? this.emailForm.get('messageBody').value : '',
          fileData: this.emailForm.get('attachments').value ? this.emailForm.get('attachments').value : []
        };
        this.emailService.createUpdateDraft(requestJson, (this.idOfMessage !== null ? this.idOfMessage : null)).subscribe(res => {
          console.log(res);
        });
        console.log("this values are saved::::::::::::", this.emailForm.value);
        this.prevStateOfForm = this.emailFormValueChange;
      }
    }, 4000);
  }

  // messageDetailApi(id) {
  //   this.emailService.gmailMessageDetail(id).subscribe(res => {

  //     // based on gmail api explorer response
  //     const { payload: parts } = res;
  //     parts.forEach(part => {
  //       if (part.mimeType === 'multipart/alternative') {
  //         const { parts } = part;
  //         parts.forEach(part => {
  //           if (part.filename !== '') {
  //             this.attachmentsIdArray.push({
  //               filename: part.filename,
  //               mimeType: part.mimeType,
  //               attachmentId: part.body.atatchmentId
  //             });
  //           }
  //         });
  //       }
  //     });
  //   })

  //   // get attachment files...
  //   this.attachmentsIdArray.forEach(attachment => {
  //     const obj = {
  //       userId: AuthService.getUserInfo().advisorId,
  //       email: AuthService.getUserInfo().emailId,
  //       attachmentId: attachment.attachmentId,
  //       messageId: this.idOfMessage
  //     }
  //     this.emailService.getAttachmentFiles(attachment.attachmentId).subscribe(res => {
  //       // according to gmail attachment get 
  //       this.attachmentsBase64Data.push({
  //         filename: attachment.filename,
  //         mimeType: attachment.mimeType,
  //         size: res.size,
  //         attachmentBase64Data: res.body.replace(/\-/g, '+').replace(/_/g, '/')
  //       })
  //     })

  //     this.attachmentsBase64Data.forEach(attachment => {
  //       let blobData = EmailUtilService.convertBase64ToBlobData(attachment.attachmentBase64Data, attachment.mimeType);

  //       if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
  //         window.navigator.msSaveOrOpenBlob(blobData, attachment.filename);
  //       } else { // chrome
  //         const blob = new Blob([blobData], { type: attachment.mimeType });
  //         const url = window.URL.createObjectURL(blob);
  //         // window.open(url);

  //         this.emailAttachments.push({
  //           filename: attachment.filename,
  //           size: attachment.size,
  //           mimeType: attachment.mimeType,
  //           data: attachment.attachmentBase64Data,
  //           downloadUrl: url
  //         });
  //       }
  //     });
  //   });
  // }

  attachmentDownload(element: any) {
    const link = document.createElement('a');
    link.href = element.downloadUrl;
    link.download = element.filename;
    link.click();
  }

  removeFileFromCollections(attachment) {
    this.emailAttachments = this.emailAttachments.filter((item) => {
      return item !== attachment
    });
  }

  createEmailForm() {
    // console.log("this is data sent from draft list ->>>>  ", this.data);
    this.emailForm = this.fb.group({
      sender: [, Validators.email],
      receiver: [[], Validators.email],
      carbonCopy: [[], Validators.email],
      blindCarbonCopy: [[], Validators.email],
      subject: [''],
      messageBody: [''],
      attachments: [''],
    });

    if (this.data) {
      const { dataObj, threadIdsArray } = this.data;
      const { idsOfThread: { id } } = dataObj;
      this.idOfMessage = id;

      this.idArray = threadIdsArray;
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
        if (element.name === "To" && element.value.includes('<')) {
          this.receipients = [
            element.value.split('<')[1].split('>')[0]
          ]
        } else if (element.name === "To" && element.value.includes(',')) {
          let toArray = [];
          toArray = element.value.split(',');
          this.receipients = toArray;
        }

        if (element.name === "Cc" && element.name.includes('<')) {
          this.ccArray = [element.value.split('<')[1].split('>')[0]]

          this.isCcSelected = true;
        } else if (element.name === 'Cc' && element.name.includes(',')) {
          let ccArray = [];
          ccArray = element.value.split(',');
          this.ccArray = ccArray;
          this.isCcSelected = true;
        }
        if (element.name === "Bcc" && element.name.includes('<')) {
          this.bccArray = [element.value.split('<')[1].split('>')[0]]
          this.isBccSelected = true;
        } else if (element.name === 'Bcc' && element.name.includes(',')) {
          let bccArray = [];
          bccArray = element.value.split(',');
          this.bccArray = bccArray;
          this.isBccSelected = true;
        }
      });
      this.getAttachmentDetails(this.data);
      this.emailForm.setValue({
        sender: this.from ? this.from : '',
        receiver: this.receipients ? this.receipients : [],
        carbonCopy: this.ccArray ? this.ccArray : [],
        blindCarbonCopy: this.bccArray ? this.bccArray : [],
        subject: this.subject ? this.subject : '',
        messageBody: this.emailBody ? this.emailBody : '',
        attachments: []
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

  add(event: MatChipInputEvent, whichArray): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      if (whichArray == this.receipients) {
        let arr = this.emailForm.get('receiver').value;
        if (arr == '') {
          arr = [];
        }
        arr.push(value.trim());
        this.emailForm.patchValue({
          receiver: arr
        });
        // this.emailForm.get('receiver').value.push({ email: value.trim() });
      } else if (whichArray == this.ccArray) {
        let arr = this.emailForm.get('carbonCopy').value;
        if (arr == '') {
          arr = [];
        }
        arr.push(value.trim());
        this.emailForm.patchValue({
          carbonCopy: arr
        })
      } else if (whichArray == this.bccArray) {

        let arr = this.emailForm.get('blindCarbonCopy').value;
        if (arr == '') {
          arr = [];
        }
        arr.push(value.trim());
        this.emailForm.patchValue({
          blindCarbonCopy: arr
        });
      }

      whichArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  // sendEmail() {
  //   console.log(this.emailForm);
  // }

  remove(item: string, whichArray): void {
    const index = whichArray.indexOf(item);

    if (index >= 0) {
      whichArray.splice(index, 1);
      if (whichArray == this.receipients) {
        let arr = this.emailForm.get('receiver').value;
        // arr.splice(index, 1);
        this.emailForm.patchValue({
          receiver: arr
        });
      } else if (whichArray == this.ccArray) {
        let arr = this.emailForm.get('carbonCopy').value;
        arr.splice(index, 1);
        this.emailForm.patchValue({
          carbonCopy: arr
        });
      } else if (whichArray == this.bccArray) {
        let arr = this.emailForm.get('blindCarbonCopy').value;
        arr.splice(index, 1);
        this.emailForm.patchValue({
          blindCarbonCopy: arr
        });
      }

    }
  }

  downloadAttachment(attachment) {
    console.log(attachment);
  }

  getAttachmentDetails(data) {
    console.log("hello i have some data ::::::::::::::", data);

    if (data !== null) {
      // const { dataObj: { attachmentFiles } } = data;
      // attachmentFiles.forEach(attachment => {
      //   const { headers } = attachment;
      //   headers.forEach(header => {
      //     if (header.name === 'X-Attachment-Id') {
      //       this.attachmentIdsArray.push(header.value);
      //     }
      //   });
      // });
    }
    // this.emailService.
    this.attachmentIdsArray.forEach(attachmentId => {
      const obj = {
        attachmentId,
        email: AuthService.getUserInfo().emailId,
        messageId: data.dataObj.idsOfMessages[0],
        userId: AuthService.getUserInfo().advisorId
      }
      console.log("this are parameters that is passed :::::", obj)
      this.emailService.getAttachmentFiles(obj).subscribe(res => console.log("attachment grabbed::::::::::::", res));
    })
  }

  close() {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  closeWithDraftCreateOrUpdate(): void {
    clearInterval(this.interval);
    console.log("cleared");
    if ((!this.data && this.data === null) && this.didFormChanged) {
      // call create api from compose

      console.log(this.emailForm);
      const requestJson = {
        toAddress: this.emailForm.get('receiver').value ? this.emailForm.get('receiver').value : [''],
        subject: this.emailForm.get('subject').value ? this.emailForm.get('subject').value : '',
        message: this.emailForm.get('messageBody').value ? this.emailForm.get('messageBody').value : '',
        fileData: this.emailForm.get('attachments').value ? this.emailForm.get('attachments').value : []
      };
      this.emailService.createUpdateDraft(requestJson, null).subscribe(res => {
        console.log(res);
      })

    } else if ((this.data && this.data !== null) && this.didFormChanged) {
      // call update api
      console.log(this.emailForm);
      const requestJson = {
        toAddress: this.emailForm.get('receiver').value ? this.emailForm.get('receiver').value : [''],
        subject: this.emailForm.get('subject').value ? this.emailForm.get('subject').value : '',
        message: this.emailForm.get('messageBody').value ? this.emailForm.get('messageBody').value : '',
        fileData: this.emailForm.get('attachments').value ? this.emailForm.get('attachments').value : []
      };
      this.emailService.createUpdateDraft(requestJson, this.idOfMessage).subscribe(res => {
        console.log(res);
      })
      console.log("call update api from detail view");

    } else if ((this.data && this.data !== null) && !this.didFormChanged) {
      // close the dialog
      console.log("close the dialog");
    }

    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  // handleCloseMail() {

  // }

  // sendMail(): void {
  //   console.log('send mail');
  //   this.handleCloseMail();
  // }

  saveData(event): void {
    this.emailForm.get('messageBody').setValue(event);
  }
  // made by gaurav 
  createUpdateDraft(id: string, toAddress: Array<any>, subject: string, bodyMessage: string, fileData: Array<any>) {
    // let encodedSubject = EmailUtilService.changeStringToBase64(subject);
    // let encodedMessage = EmailUtilService.changeStringToBase64(bodyMessage);
    const requestJson = {
      id,
      toAddress,
      subject: subject,
      message: bodyMessage,
      fileData
    };

    console.log('LeftSidebarComponent createUpdateDraft requestJson : ', requestJson);
    this.emailService.createUpdateDraft(requestJson, null)
      .subscribe((responseJson) => {
        console.log(responseJson);
      }, (error) => {
        console.error(error);
      });
  }

  getFileDetails(e) {
    console.log('LeftSidebarComponent getFileDetails e : ', e.target.files[0]);
    const singleFile = e.target.files[0];

    EmailUtilService.getBase64FromFile(singleFile, (successData) => {
      let blobData = EmailUtilService.convertBase64ToBlobData(successData.split(',')[1], singleFile.type);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
        window.navigator.msSaveOrOpenBlob(blobData, singleFile.filename);
      } else {
        // chrome
        const blob = new Blob([blobData], { type: singleFile.type });
        const url = window.URL.createObjectURL(blob);

        this.emailAttachments.push({
          filename: singleFile.name,
          size: singleFile.size,
          mimeType: singleFile.type,
          data: successData,
          downloadUrl: url
        });
      }

      // this.createUpdateDraft(null, ['gaurav@futurewise.co.in'],
      //   'This is a test message', 'This is a test message body', fileData);

      // this.createUpdateDraft()
    });

    // this.emailAttachments = fileData;
    // console.log(this.emailAttachments);
  }

  onSendEmail() {
    const body = {
      userId: AuthService.getUserInfo().advisorId,
      email: AuthService.getUserInfo().emailId,
      toAddress: this.emailForm.get('receiver').value,
      ccs: this.emailForm.get('carbonCopy').value,
      bccs: this.emailForm.get('blindCarbonCopy').value,
      subject: this.emailForm.get('subject').value,
      message: this.emailForm.get('messageBody').value,
      attachments: this.emailAttachments
    }

    console.log(body);
    this.emailService.sendEmail(body).subscribe(res => {
      console.log(res);
      this.close();
    });

  }

  ngOnDestroy(): void {
    if (this.emailFormChangeSubscription) {
      this.emailFormChangeSubscription.unsubscribe();
    }
  }
}
