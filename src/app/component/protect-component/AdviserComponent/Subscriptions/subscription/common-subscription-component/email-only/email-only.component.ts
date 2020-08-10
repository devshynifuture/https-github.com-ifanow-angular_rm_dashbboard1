import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR, FormGroup, FormBuilder} from '@angular/forms';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from '../../../../../../../auth-service/authService';
import {ValidatorType, UtilService} from '../../../../../../../services/util.service';
import {MatChipInputEvent, MatDialog} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {OrgSettingServiceService} from '../../../../setting/org-setting-service.service';
import {PeopleService} from 'src/app/component/protect-component/PeopleComponent/people.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {element} from 'protractor';
import {DatePipe} from '@angular/common';
import {DocumentPreviewComponent} from '../document-preview/document-preview.component';
import {apiConfig} from 'src/app/config/main-config';

@Component({
  selector: 'app-email-only',
  templateUrl: './email-only.component.html',
  // templateUrl: './invoice-pdf.html',

  styleUrls: ['./email-only.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailOnlyComponent),
      multi: true
    }
  ]
})
export class EmailOnlyComponent implements OnInit {

  model: any;
  showfromEmail: any;
  userId: any;
  verifiedEmailsList: any[] = [];
  emailTemplateGroup: FormGroup;

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SEND',
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

  barButtonOptions1: MatProgressButtonOptions = {
    active: false,
    text: 'SEND WITH ESIGN',
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
  emailLists: any;

  @Input() set data(inputData) {
    this.emailTemplateGroup = this.fb.group({
      emailId: [''],
      subject: ['']
    });
    const obj = [];
    this.doc = inputData.documentList;
    this.showfromEmail = inputData.showfromEmail;
    if (inputData.isInv) {
      this.doc.forEach(element => {
        if (element) {
          const obj1 = {
            id: element.id,
            documentName: element.invoiceNumber,
            documentText: element.documentText
          };
          obj.push(obj1);
        }
      });
    } else {
      this.doc.forEach(element => {
        if (element) {
          const obj1 = {
            id: element.id,
            documentName: element.documentName,
            documentText: element.documentText

          };
          obj.push(obj1);
        }
      });
    }

    this.docObj = obj;
    this._inputData = inputData;
    if (!inputData.openedFrom) {
      this.getEmailTemplateFilterData(inputData);
    } else {
      this.emailBody = inputData.clientData.documentText;
      this.barButtonOptions.text = 'SAVE';
    }
    this.getClientData(this._inputData.clientData);
  }

  get data() {
    return this._inputData;
  }

  dataSub: any;
  emailBody: any;
  subject;
  doc: any;
  docObj: any[];
  advisorId;
  validatorType = ValidatorType;
  emailIdList = [];
  @Input() emailSend;
  @Input() emailSendfooter;
  @Input() emailDocumentSend;
  @Input() emailDocument;
  @Output() valueChange = new EventEmitter();
  @Input() quotationData;
  _inputData;
  emailData;
  advisorData: any;
  visible = true;

  config = {
    charCounterCount: false
  };
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public eventService: EventService, public subInjectService: SubscriptionInject,
              public subscription: SubscriptionService, private orgSetting: OrgSettingServiceService,
              private fb: FormBuilder, private peopleService: PeopleService, private datePipe: DatePipe
    , public dialog: MatDialog, private utilservice: UtilService) {
    this.advisorId = AuthService.getAdvisorId();
    this.userId = AuthService.getUserId();
  }

  ngOnInit() {
    // this.getEmailTemplate();
    //this.getAllEmails();
    this.getEmailList()
  }

  getEmailList() {
    let obj = {
      advisorId: this.advisorId
    }
    this.peopleService.getEmailList(obj).subscribe(
      data => this.getEmailListRes(data),
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
      }
    );
  }

  getEmailListRes(data) {
    this.emailLists = data
    console.log('getEmailList', data)
  }

  getClientData(data) {
    const obj = {
      clientId: data.clientId
    };
    this.peopleService.getClientOrLeadData(obj).subscribe(
      data => {
        if (data) {
          if (data.emailList && data.emailList.length > 0) {
            this.emailIdList.push({emailAddress: data.emailList[0].email});
          }
        }
      });
  }

  getAllEmails() {
    const obj = {
      advisorId: this.advisorId,
      templateType: (this._inputData.templateType) ? this._inputData.templateType : this._inputData.emailTemplateTypeId,

      // advisorId: this.advisorId
    };
    this.subscription.getVerifiedEmailData(obj).subscribe(
      data => {
        if (data) {
          this.verifiedEmailsList = [data.listItems];
          console.log('getVerifiedEmailData', data)
          // if (!this._inputData.fromEmail) {
          this._inputData.fromEmail = (this.verifiedEmailsList && this.verifiedEmailsList.length == 1) ? this.verifiedEmailsList[0].emailAddress : '';
          // }
        }
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
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

  saveEmailTemplate() {
    this.barButtonOptions1.active = true;
    const obj = {
      id: this._inputData.id,
      fromEmail: this._inputData.fromEmail,
      body: this.emailBody,
      subject: this._inputData.subject,
      emailTemplateTypeId: this._inputData.emailTemplateTypeId
    };
    this.orgSetting.editPreEmailTemplate(obj).subscribe(
      data => this.editEmailTempalatRes(data),
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );

  }

  editEmailTempalatRes(data) {
    this.close(true);
  }

  getEmailTemplateFilterData(invoiceData) {

    const data = {
      advisorId: this._inputData.advisorId,
      clientId: this._inputData.clientData.clientId,
      templateType: this._inputData.templateType,
      id: this._inputData.documentList[0].id
    };
    this.subscription.getEmailTemplateFilterData(data).subscribe(responseData => {
      this.emailData = responseData;
      this._inputData.subject = this.emailData.subject;
      this.emailBody = this.emailData.body;
      this.emailBody.replace('$client_name', invoiceData.clientData.clientName);
      this.emailBody.replace('$advisor_name', AuthService.getUserInfo().fullName);
    }, error => {
      this.eventService.openSnackBar(error, 'Dismiss', () => {
      });
    });
  }

  close(flag) {
    this.subInjectService.changeUpperRightSliderState({state: 'close', refreshRequired: flag});
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
  }

  getEmailTemplate() {
    const obj = {
      advisorId: this.advisorId,
      templateId: 1
    };
    this.subscription.getEmailTemplateFilterData(obj).subscribe(
      data => this.getTemplateData(data)
    );
  }

  getTemplateData(data) {
  }

  openEmailQuot(value, state) {
    this.eventService.sliderData(value);
    this.subInjectService.rightSliderData(state);
  }

  getcommanFroalaData(data) {
    this._inputData = data;
    this.emailBody = data;

  }

  save() {
    this.updateData(this.emailBody);
    this.close(true);
  }

  updateData(data) {
    const obj = {
      id: data.documentRepositoryId, // pass here advisor id for Invoice advisor
      docText: data.documentText
    };

    this.subscription.updateDocumentData(obj).subscribe(
      responseJson => this.getResponseData(responseJson)
    );
  }

  getResponseData(data) {
    this.barButtonOptions.active = false;
    this.barButtonOptions1.active = false;
    this.close(true);
  }

  saveData(data) {
    this.emailBody = data;
  }

  sendEmail() {
    if (this._inputData.fromEmail == undefined) {
      this.eventService.openSnackBar('Please enter to email', 'Dismiss');
      return;
    }
    if (this.emailIdList.length == 0) {
      this.eventService.openSnackBar('Please enter email ');
      return;
    }
    if (this._inputData && this._inputData.documentList.length > 0) {
    } else {
      this.eventService.openSnackBar('Please select a document to send email.', 'Dismiss');
      return;
    }
    if (this._inputData.templateType == 3) {

      const inviteeList = [];
      this.emailIdList.forEach(singleEmail => {
        inviteeList.push({
          name: this._inputData.clientName ? this._inputData.clientName : singleEmail.emailAddress,
          email: singleEmail.emailAddress,
          webhook: {
            success: apiConfig.MAIN_URL + 'subscription/invoice/esignSuccessResponse/post',
            failure: apiConfig.MAIN_URL + 'subscription/invoice/esignSuccessResponse/post1',
            version: 2.1
          },
        });
      });
      const emailRequestData = {
        invitee: inviteeList,
        sub_document_id: this._inputData.documentList[0].id,
        file: {
          name: this._inputData.documentList[0].documentName
        },
        documentList: this._inputData.documentList,
        messageBody: this.emailBody,
        emailSubject: this.subject,
      };
      this.barButtonOptions.active = true;
      this.subscription.documentEsignRequest(emailRequestData).subscribe(
        data => this.getResponseData(data)
      );
    } else {
      const emailRequestData: any = {
        messageBody: this.emailBody,
        emailSubject: this._inputData.subject,
        fromEmail: this._inputData.fromEmail,
        toEmail: this.emailIdList,
        documentList: this._inputData.documentList,
        document_id: this._inputData.documentList[0].id,
        attachmentName: this._inputData.documentList[0].documentName
      };
      if (this._inputData.templateType == 2) {
        emailRequestData.quotation = true;
      }
      this.barButtonOptions.active = true;
      this.subscription.sendDocumentViaEmailInPdfFormat(emailRequestData).subscribe(
        data => this.getResponseData(data)
      );
    }
  }

  sendInvoiceEmail() {
    if (this._inputData.fromEmail == undefined) {
      this.eventService.openSnackBar('Please enter to email', 'Dismiss');
      return;
    }
    if (this.emailIdList.length == 0) {
      this.eventService.openSnackBar('Please enter email ');
      return;
    }
    if (this._inputData && this._inputData.documentList.length > 0) {
    } else {
      this.eventService.openSnackBar('Please select a invoice to send email.', 'Dismiss');
      return;
    }
    this._inputData.documentList[0].fromDate = new Date(this._inputData.documentList[0].fromDate);
    this._inputData.documentList[0].dueDate = new Date(this._inputData.documentList[0].dueDate);
    this._inputData.documentList[0].invoiceDate = new Date(this._inputData.documentList[0].invoiceDate);
    this._inputData.documentList[0].toDate = new Date(this._inputData.documentList[0].toDate);
    this.barButtonOptions.active = true;
    const invoiceObj = {
      messageBody: this.emailBody,
      emailSubject: this._inputData.subject,
      fromEmail: this._inputData.fromEmail,
      toEmail: this.emailIdList,
      invoices: this._inputData.documentList,
      document_id: this._inputData.documentList[0].id,
      attachmentName: this._inputData.documentList[0].documentName
    };
    this.subscription.sendInvoiceEmail(invoiceObj).subscribe(
      data => {
        this.barButtonOptions.active = false;
        this.getResponseData(data);
      }, err => {
        this.barButtonOptions.active = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  sendWithEsign() {
    if (this._inputData.fromEmail == undefined) {
      this.eventService.openSnackBar('Please enter to email', 'Dismiss');
      return;
    }
    if (this.emailIdList.length == 0) {
      this.eventService.openSnackBar('Please enter email ');
      return;
    }
    this.barButtonOptions1.active = true;
    const inviteeList = [];
    this.emailIdList.forEach(singleEmail => {
      inviteeList.push({
        name: this._inputData.clientName ? this._inputData.clientName : singleEmail.emailAddress,
        email: singleEmail.emailAddress,
        webhook: {
          success: apiConfig.MAIN_URL + 'subscription/invoice/esignSuccessResponse/post',
          failure: apiConfig.MAIN_URL + 'subscription/invoice/esignSuccessResponse/post1',
          version: 2.1
        },
      });
    });
    const emailRequestData = {
      invitee: inviteeList,
      sub_document_id: this._inputData.documentList[0].id,
      file: {
        name: this._inputData.documentList[0].documentName
      },
      documentList: this._inputData.documentList,
      messageBody: this.emailBody,
      emailSubject: this.subject,
    };
    this.barButtonOptions.active = true;
    this.subscription.documentEsignRequest(emailRequestData).subscribe(
      data => this.getResponseData(data)
    );
  }

  removeEmailId(index) {
    // const index = this.emailIdList.indexOf(singleEmail);

    // if (index >= 0) {
    if (this.emailIdList.length == 1) {
      return;
    }
    this.emailIdList.splice(index, 1);
    // }
  }

  onEmailIdEntryKeyPress(event) {
    const inputChar = event.key;
    if (inputChar == ',') {
      event.preventDefault();
      const emailId = this._inputData.clientData.userEmailId;
      this.emailIdList.push({emailAddress: emailId});
      this._inputData.clientData.userEmailId = '';
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if (value && value.length > 0) {
      if (this.validatorType.EMAIL.test(value)) {
        this.emailIdList.push({emailAddress: value});
      } else {
        this.eventService.openSnackBar('Enter valid email address', 'Dismiss');
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(singleEmail): void {
    this.docObj.splice(singleEmail, 1);
  }

  previewDocument(data) {
    const obj = {
      data: data.documentText,
      cancelButton: () => {
        this.utilservice.htmlToPdf(data.documentText, 'document', '');
        dialogRef.close();
      }
    };
    const dialogRef = this.dialog.open(DocumentPreviewComponent, {
      width: '65vw',
      height: '900px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }
}
