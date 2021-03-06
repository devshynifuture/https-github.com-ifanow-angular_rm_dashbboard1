import { calendarService } from "./../../../Activities/calendar/calendar.service";
import { AuthService } from "./../../../../../../auth-service/authService";
import { EmailUtilService } from "./../../../../../../services/email-util.service";
import { FormBuilder, FormGroup, Form, FormControl } from "@angular/forms";
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";

import { SubscriptionService } from "./../../../Subscriptions/subscription.service";
import { SubscriptionInject } from "./../../../Subscriptions/subscription-inject.service";
import { EmailServiceService } from "./../../email-service.service";
import { EventService } from "./../../../../../../Data-service/event.service";
import { Validators } from "@angular/forms";
import { Subscription, from, of, BehaviorSubject } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material";
import { EmailAttachmentI } from "../email.interface";
import { tap, debounceTime, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-compose-email",
  templateUrl: "./compose-email.component.html",
  styleUrls: ["./compose-email.component.scss"],
})
export class ComposeEmailComponent implements OnInit, OnDestroy {
  attachmentsIdArray: {
    filename: string;
    mimeType: string;
    attachmentId: string;
  }[] = [];
  attachmentsBase64Data: {
    filename: string;
    size: number;
    attachmentBase64Data: string;
    mimeType: string;
  }[] = [];
  attachmentArrayDetail: Array<any> = [];
  advisorId: any = AuthService.getAdvisorId();
  currentDraftGmailThread: any = "";
  isLoadingForAttachment: boolean;
  refreshRequired: boolean = false;
  showSaving = false;
  saveDraftComplete: boolean;
  isCustomerEmail: any;
  editRecepient: boolean;
  contactList: any = [];
  manualContactAdd: boolean = false;

  constructor(
    private subInjectService: SubscriptionInject,
    public subscription: SubscriptionService,
    public eventService: EventService,
    private emailService: EmailServiceService,
    private calendarService: calendarService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  receipentEmail: string;
  subject: string = "";
  emailBody: string = "";
  from: string = AuthService.getUserInfo().email;
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
  toCreateOrUpdate: string = "";
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
  canDeletePrevDraft = false;
  private nullObs = new BehaviorSubject(null);

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  interval;
  emailFormValueChange = {};
  emailAttachments: EmailAttachmentI[] = [];
  currentDraftIds = [];
  gmailDraftThread;
  choice;
  toFC = new FormControl();
  bccFC = new FormControl();
  ccFC = new FormControl();

  @ViewChild('toRef', { static: false }) toRef: ElementRef<HTMLInputElement>;
  @ViewChild('bccRef', { static: false }) bccRef: ElementRef<HTMLInputElement>;
  @ViewChild('ccRef', { static: false }) ccRef: ElementRef<HTMLInputElement>;


  ngOnInit() {
    console.log("compose getting value data:::::", this.data);
    this.choice = this.data.choice;

    if (this.router.url.split("/").includes("customer")) {
      this.isCustomerEmail = true;
    } else {
      this.isCustomerEmail = false;
    }
    this.createEmailForm();
  }

  initPoint() {
    this.prevStateOfForm = this.emailForm.value;

    let attachmentIds = [];
    if (this.data.choice === "draft") {
      this.data.dataToSend.dataObj.attachmentArrayObjects.forEach((element) => {
        attachmentIds.push(element.id);
      });
    }

    this.calendarService
      .getAttendyList({ userId: this.advisorId })
      .subscribe((res) => {
        if (res) {
          this.contactList = res;
          console.log("this is contact email address ", res);
        } else {
          this.contactList = [];
          this.manualContactAdd = true;
        }
      });

    // for updation draft
    this.emailForm.valueChanges
      .pipe(
        debounceTime(5000),
        switchMap((value) => this.createDraft(value))
      )
      .subscribe((res) => {
        if (res) {
          this.refreshRequired = true;
          console.log(res);
          this.currentDraftIds.push(res.message.id);
          if (this.currentDraftIds.length == 2) {
            this.deleteDraft();
          }
          if (this.choice == "email") {
            this.saveDraftComplete = true;
            setTimeout(() => (this.showSaving = false), 2000);
          }
          console.log(this.currentDraftIds, "draft ids:::");
          this.refreshRequired = true;
        }
      });
  }

  selected(event, choice): void {
    switch (choice) {
      case 'to':
        this.receipients.push(event.option.viewValue);
        this.toRef.nativeElement.value = '';
        this.toFC.setValue(null);
        break
      case 'cc':
        this.ccArray.push(event.option.viewValue);
        this.ccRef.nativeElement.value = '';
        this.ccFC.setValue(null);
        break;
      case 'bcc':
        this.bccArray.push(event.option.viewValue);
        this.bccRef.nativeElement.value = '';
        this.bccFC.setValue(null);
        break;
    }
  }

  createDraft(value) {
    if (!this.areTwoObjectsEquivalent(this.prevStateOfForm, value)) {
      this.saveDraftComplete = false;
      this.showSaving = true;

      console.log(
        "this is csoem value i need to see::::",
        this.prevStateOfForm,
        value
      );
      let createRequestJson;
      let attachmentIds = [];
      if (this.data.choice === "draft") {
        this.data.dataToSend.dataObj.attachmentArrayObjects.forEach(
          (element) => {
            attachmentIds.push(element.id);
          }
        );
      }
      // create draft
      createRequestJson = {
        toAddress: this.emailForm.get("receiver").value
          ? this.emailForm.get("receiver").value
          : [""],
        subject: this.emailForm.get("subject").value
          ? this.emailForm.get("subject").value
          : "",
        message: this.emailForm.get("messageBody").value
          ? this.emailForm.get("messageBody").value.replace(/(<([^>]+)>)/gi, "")
          : "",
        fileData:
          this.emailAttachments && this.emailAttachments.length !== 0
            ? this.emailAttachments
            : [],
        attachmentIds,
        attachments: this.emailAttachments,
        bccs: this.bccArray,
        ccs: this.ccArray,
      };

      console.log(createRequestJson);
      this.prevStateOfForm = value;
      return this.emailService.createDraft(createRequestJson);
    } else {
      return this.nullObs.asObservable();
    }
  }

  deleteDraft() {
    let attachmentIds = [];
    if (this.data.choice === "draft") {
      this.data.dataToSend.dataObj.attachmentArrayObjects.forEach((element) => {
        attachmentIds.push(element.id);
      });
    }
    this.emailService
      .deleteThreadsFromTrashForever([this.currentDraftIds[0]])
      .subscribe((res) => {
        if (res) {
          console.log("this is deleted", res);
          this.currentDraftIds.shift();
          console.log(this.currentDraftIds, "draft ids::: after deletion");
          this.saveDraftComplete = true;
          setTimeout(() => (this.showSaving = false), 2000);
        }
      });
  }

  messageDetailApi(id) {
    this.isLoadingForAttachment = true;
    this.emailService.gmailMessageDetail(id).subscribe((res) => {
      // based on gmail api explorer response

      const {
        payload: { parts },
      } = res;
      if (parts && parts.length !== 0) {
        parts.forEach((part) => {
          if (part.mimeType === "multipart/alternative") {
            // const { parts } = part;
            // parts.forEach(part => {
            if (part.filename !== "") {
              this.attachmentsIdArray.push({
                filename: part.filename,
                mimeType: part.mimeType,
                attachmentId: part.body.atatchmentId,
              });
            }
            // });
          }
        });
      }
    });

    // get attachment files...
    this.attachmentsIdArray.forEach((attachment) => {
      const obj = {
        userId: AuthService.getUserInfo().advisorId,
        email: AuthService.getUserInfo().userName,
        attachmentId: attachment.attachmentId,
        messageId: this.idOfMessage,
      };
      let attachmentBase64Array = [];
      this.emailService.getAttachmentFiles(obj).subscribe((res) => {
        // according to gmail attachment get
        const obj = {
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: res.size,
          attachmentBase64Data: res.body.replace(/\-/g, "+").replace(/_/g, "/"),
        };
        attachmentBase64Array.push(obj);
      });

      attachmentBase64Array.forEach((attachment) => {
        let blobData = EmailUtilService.convertBase64ToBlobData(
          attachment.attachmentBase64Data,
          attachment.mimeType
        );

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //IE
          window.navigator.msSaveOrOpenBlob(blobData, attachment.filename);
        } else {
          // chrome
          const blob = new Blob([blobData], { type: attachment.mimeType });
          const url = window.URL.createObjectURL(blob);
          // window.open(url);

          this.emailAttachments.push({
            filename: attachment.filename,
            size: attachment.size,
            mimeType: attachment.mimeType,
            data: attachment.attachmentBase64Data,
            downloadUrl: url,
          });
        }
      });
    });
  }

  attachmentDownload(element: any) {
    const link = document.createElement("a");
    link.href = element.downloadUrl;
    link.download = element.filename;
    link.click();
  }

  removeFileFromCollections(attachment) {
    this.emailAttachments = this.emailAttachments.filter((item) => {
      return item !== attachment;
    });
  }

  createEmailForm() {
    if (this.isCustomerEmail) {
      let clientData = AuthService.getClientData();
      let clientEmail = clientData.emailList[0].email;
      console.log("this is some client email:::", clientEmail);
      this.receipients = [clientEmail];
      this.editRecepient = false;
      this.removable = false;
    } else {
      this.editRecepient = true;
      this.removable = true;
    }

    this.emailForm = this.fb.group({
      sender: ["", Validators.email],
      receiver: [[], Validators.email],
      carbonCopy: [[], Validators.email],
      blindCarbonCopy: [[], Validators.email],
      subject: [""],
      messageBody: [""],
      attachments: [""],
    });

    if (this.data && this.data.dataToSend !== null) {
      let data = this.data.dataToSend;
      const { dataObj, threadIdsArray } = data;
      const {
        idsOfThread: { id },
      } = dataObj;
      this.idOfMessage = id;
      if (this.data.choice === "draft") {
        this.currentDraftIds.push(this.idOfMessage);
      }

      this.idArray = threadIdsArray;
      const {
        subjectMessage: { subject, message },
      } = dataObj;
      const { date } = dataObj;
      this.date = date;
      this.subject = subject;
      this.emailBody = message;
      const {
        parsedData: { headers },
      } = dataObj;

      headers.forEach((element) => {
        if (element.name === "From") {
          if (element.value.includes("<")) {
            this.from = element.value.split("<")[1].split(">")[0];
          } else {
            this.from = element.value;
          }
        }
        if (element.name === "To" && element.value.includes("<")) {
          this.receipients = [element.value.split("<")[1].split(">")[0]];
        } else if (element.name === "To" && element.value.includes(",")) {
          let toArray = [];
          toArray = element.value.split(",");
          this.receipients = toArray;
        }

        if (element.name === "Cc" && element.name.includes("<")) {
          this.ccArray = [element.value.split("<")[1].split(">")[0]];

          this.isCcSelected = true;
        } else if (element.name === "Cc" && element.name.includes(",")) {
          let ccArray = [];
          ccArray = element.value.split(",");
          this.ccArray = ccArray;
          this.isCcSelected = true;
        }
        if (element.name === "Bcc" && element.name.includes("<")) {
          this.bccArray = [element.value.split("<")[1].split(">")[0]];
          this.isBccSelected = true;
        } else if (element.name === "Bcc" && element.name.includes(",")) {
          let bccArray = [];
          bccArray = element.value.split(",");
          this.bccArray = bccArray;
          this.isBccSelected = true;
        }
      });

      this.getAttachmentDetails(this.data.dataToSend);

      if (this.isCustomerEmail) {
        let clientData = AuthService.getClientData();
        let clientEmail = clientData.emailList[0].email;
        console.log("this is some client email:::", clientEmail);
        this.receipients = [clientEmail];
        this.editRecepient = false;
        this.removable = false;

        this.emailForm.setValue(
          {
            sender: this.from ? this.from : "",
            receiver: this.receipients ? this.receipients : [],
            carbonCopy: this.ccArray ? this.ccArray : [],
            blindCarbonCopy: this.bccArray ? this.bccArray : [],
            subject: this.subject ? this.subject : "",
            messageBody: this.emailBody ? this.emailBody : "",
            attachments: [],
          },
          { emitEvent: false }
        );
      } else {
        this.editRecepient = true;
        this.removable = true;

        this.emailForm.setValue(
          {
            sender: this.from ? this.from : "",
            receiver: this.receipients ? this.receipients : [],
            carbonCopy: this.ccArray ? this.ccArray : [],
            blindCarbonCopy: this.bccArray ? this.bccArray : [],
            subject: this.subject ? this.subject : "",
            messageBody: this.emailBody ? this.emailBody : "",
            attachments: [],
          },
          { emitEvent: false }
        );
      }

      // this.emailForm.setValue({
      //   sender: this.from ? this.from : '',
      //   receiver: this.receipients ? this.receipients : [],
      //   carbonCopy: this.ccArray ? this.ccArray : [],
      //   blindCarbonCopy: this.bccArray ? this.bccArray : [],
      //   subject: this.subject ? this.subject : '',
      //   messageBody: this.emailBody ? this.emailBody : '',
      //   attachments: []
      // }, { emitEvent: false });
    }
    this.initPoint();
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
    this.emailForm.get("carbonCopy").setValue("");
  }

  toggleBCC(): void {
    this.isBccSelected = !this.isBccSelected;
    this.emailForm.get("blindCarbonCopy").setValue("");
  }

  // sendEmail() {
  //   const emailRequestData = {
  //     body: this.emailBody,
  //     subject: this.subject,
  //     fromEmail: this.emailData.fromEmail,
  //     toEmail: [{ emailId: this._inputData.clientData.userEmailId, sendType: 'to' }],
  //     documentList: this._inputData.documentList
  //   };
  // }

  add(event: MatChipInputEvent, whichArray): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      if (whichArray == "receipients") {
        let arr = this.emailForm.get("receiver").value;
        if (arr == "") {
          arr = [];
        }
        arr.push(value.trim());
        this.emailForm.patchValue({
          receiver: arr,
        });
        // this.emailForm.get('receiver').value.push({ email: value.trim() });
      } else if (whichArray == "ccArray") {
        let arr = this.emailForm.get("carbonCopy").value;
        if (arr == "") {
          arr = [];
        }
        arr.push(value.trim());
        this.emailForm.patchValue({
          carbonCopy: arr,
        });
      } else if (whichArray == "bccArray") {
        let arr = this.emailForm.get("blindCarbonCopy").value;
        if (arr == "") {
          arr = [];
        }
        arr.push(value.trim());
        this.emailForm.patchValue({
          blindCarbonCopy: arr,
        });
      }
      switch (whichArray) {
        case "receipients":
          this.receipients.push(value.trim());
          break;
        case "ccArray":
          this.ccArray.push(value.trim());
          break;
        case "bccArray":
          this.bccArray.push(value.trim());
          break;
      }
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
  // sendEmail() {
  // }

  remove(item: string, whichArray): void {
    const index = whichArray.indexOf(item);

    if (index >= 0) {
      whichArray.splice(index, 1);
      if (whichArray == "receipients") {
        let arr = this.emailForm.get("receiver").value;
        // arr.splice(index, 1);
        this.emailForm.patchValue({
          receiver: arr,
        });
      } else if (whichArray == "ccArray") {
        let arr = this.emailForm.get("carbonCopy").value;
        arr.splice(index, 1);
        this.emailForm.patchValue({
          carbonCopy: arr,
        });
      } else if (whichArray == "bccArray") {
        let arr = this.emailForm.get("blindCarbonCopy").value;
        arr.splice(index, 1);
        this.emailForm.patchValue({
          blindCarbonCopy: arr,
        });
      }
    }
  }

  downloadAttachment(attachment) { }

  getAttachmentDetails(data) {
    if (data !== null) {
      this.isLoadingForAttachment = true;
      // this.emailService.
      data.dataObj.attachmentArrayObjects.forEach((attachmentObj, index) => {
        const obj = {
          attachmentId: attachmentObj.id,
          email: AuthService.getUserInfo().userName,
          messageId: data.dataObj.idsOfMessages[0],
          userId: AuthService.getUserInfo().advisorId,
        };
        this.emailService.getAttachmentFiles(obj).subscribe((res) => {
          if (index === data.dataObj.attachmentArrayObjects.length - 1) {
            this.isLoadingForAttachment = false;
          }
          console.log("attachment details:::", res);
          const resBase64 = res.data.replace(/\-/g, "+").replace(/_/g, "/");
          this.creationOfUrlAndBase64File(resBase64, attachmentObj);
        });
      });
    }
  }

  creationOfUrlAndBase64File(resBase64, attachmentObj) {
    let blobData = EmailUtilService.convertBase64ToBlobData(
      resBase64,
      attachmentObj.mimeType
    );

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //IE
      window.navigator.msSaveOrOpenBlob(blobData, attachmentObj.filename);
    } else {
      // chrome
      const blob = new Blob([blobData], { type: attachmentObj.mimeType });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);

      this.emailAttachments.push({
        filename: attachmentObj.filename,
        size: resBase64.size,
        mimeType: attachmentObj.filename,
        data: resBase64,
        downloadUrl: url,
      });
    }
  }

  close() {
    this.subInjectService.changeNewRightSliderState({
      state: "close",
      refreshRequired: this.refreshRequired,
    });
  }

  closeWithDraftCreateOrUpdate(): void {
    clearInterval(this.interval);
    // if ((!this.data && this.data === null) && this.didFormChanged) {
    //   // call create api from compose

    //   const requestJson = {
    //     toAddress: this.emailForm.get('receiver').value ? this.emailForm.get('receiver').value : [''],
    //     subject: this.emailForm.get('subject').value ? this.emailForm.get('subject').value : '',
    //     message: this.emailForm.get('messageBody').value ? this.emailForm.get('messageBody').value : '',
    //     fileData: this.emailForm.get('attachments').value ? this.emailForm.get('attachments').value : []
    //   };

    //   this.emailService.createUpdateDraft(requestJson, null).subscribe(res => {
    //   })

    // } else if ((this.data && this.data !== null) && this.didFormChanged) {
    //   // call update api
    //   const requestJson = {
    //     toAddress: this.emailForm.get('receiver').value ? this.emailForm.get('receiver').value : [''],
    //     subject: this.emailForm.get('subject').value ? this.emailForm.get('subject').value : '',
    //     message: this.emailForm.get('messageBody').value ? this.emailForm.get('messageBody').value : '',
    //     fileData: this.emailForm.get('attachments').value ? this.emailForm.get('attachments').value : []
    //   };
    //   this.emailService.createUpdateDraft(requestJson, this.idOfMessage).subscribe(res => {
    //   })

    // } else if ((this.data && this.data !== null) && !this.didFormChanged) {
    //   // close the dialog
    // }

    // this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    // this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  // handleCloseMail() {

  // }

  // sendMail(): void {
  //   this.handleCloseMail();
  // }

  saveData(event): void {
    this.emailForm.get("messageBody").setValue(event);
  }
  // made by gaurav
  createUpdateDraft(
    id: string,
    toAddress: Array<any>,
    subject: string,
    bodyMessage: string,
    fileData: Array<any>
  ) {
    // let encodedSubject = EmailUtilService.changeStringToBase64(subject);
    // let encodedMessage = EmailUtilService.changeStringToBase64(bodyMessage);
    const requestJson = {
      id,
      toAddress,
      subject: subject,
      message: bodyMessage,
      fileData,
    };

    this.emailService.createUpdateDraft(requestJson, null).subscribe(
      (responseJson) => { },
      (error) => {
        console.error(error);
      }
    );
  }

  getFileDetails(e) {
    const singleFile = e.target.files[0];

    EmailUtilService.getBase64FromFile(singleFile, (successData) => {
      let blobData = EmailUtilService.convertBase64ToBlobData(
        successData.split(",")[1],
        singleFile.type
      );
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //IE
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
          downloadUrl: url,
        });
      }

      // this.createUpdateDraft(null, ['gaurav@futurewise.co.in'],
      //   'This is a test message', 'This is a test message body', fileData);

      // this.createUpdateDraft()
    });

    // this.emailAttachments = fileData;
  }

  onSendEmail() {
    const body = {
      userId: AuthService.getUserInfo().advisorId,
      email: AuthService.getUserInfo().userName,
      toAddress: this.emailForm.get("receiver").value,
      ccs: this.emailForm.get("carbonCopy").value,
      bccs: this.emailForm.get("blindCarbonCopy").value,
      subject: this.emailForm.get("subject").value,
      message: this.emailForm
        .get("messageBody")
        .value.replace(/(<([^>]+)>)/gi, ""),
      attachments: this.emailAttachments,
    };

    this.emailService.sendEmail(body).subscribe((res) => {
      this.refreshRequired = true;
      this.close();
    });
  }

  ngOnDestroy(): void {
    if (this.emailFormChangeSubscription) {
      this.emailFormChangeSubscription.unsubscribe();
    }
  }
}
