import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { ValidatorType } from '../../../../../../../services/util.service';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OrgSettingServiceService } from '../../../../setting/org-setting-service.service';

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

  @Input() set data(inputData) {
    const obj = [];
    this.doc = inputData.documentList;
    this.showfromEmail = inputData.showfromEmail
    console.log('check flag *******', this.showfromEmail)
    if (inputData.isInv) {
      this.doc.forEach(element => {
        if (element) {
          const obj1 = {
            id: element.id,
            documentName: element.invoiceNumber
          };
          obj.push(obj1);
        }
      });
    } else {
      this.doc.forEach(element => {
        if (element) {
          const obj1 = {
            id: element.id,
            documentName: element.documentName
          };
          obj.push(obj1);
        }
      });
    }

    this.docObj = obj;
    this._inputData = inputData;
    if (this.showfromEmail == false) {
      this.getEmailTemplateFilterData(inputData);
    } else {
      this.emailBody = inputData.clientData.documentText;
    }
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
    public subscription: SubscriptionService, private orgSetting: OrgSettingServiceService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    // this.getEmailTemplate();
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
    let obj = {
      id: this._inputData.id,
      fromEmail: this._inputData.fromEmail,
      body: this.emailBody,
      subject: this._inputData.subject,
      emailTemplateTypeId: this._inputData.emailTemplateTypeId
    }
    console.log('send email obj =',obj)
    this.orgSetting.editPreEmailTemplate(obj).subscribe(
      data => this.editEmailTempalatRes(data),
      err => this.eventService.openSnackBar(err, "Dismiss")
    );

  }
  editEmailTempalatRes(data) {
    console.log(data)
    this.close(true);
  }
  getEmailTemplateFilterData(invoiceData) {

    const data = {
      advisorId: this._inputData.advisorId,
      clientId: this._inputData.clientData.id,
      templateType: this._inputData.templateType
    };
    this.subscription.getEmailTemplateFilterData(data).subscribe(responseData => {
      this.emailData = responseData;
      this.subject = this.emailData.subject;
      this.emailBody = this.emailData.body;
      console.log('Invoice Data', invoiceData.clientData.clientName);
      this.emailBody.replace('$client_name', invoiceData.clientData.clientName);
      this.emailBody.replace('$advisor_name', AuthService.getUserInfo().fullName);
    }, error => {
      this.eventService.openSnackBar(error, 'Dismiss', () => {
        console.log('Dismiss was clicked');
      });
    });
  }
  
  close(flag) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close', refreshRequired: flag });
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
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
    console.log(data);
  }

  openEmailQuot(value, state) {
    this.eventService.sliderData(value);
    this.subInjectService.rightSliderData(state);
  }

  getcommanFroalaData(data) {
    console.log(data);
    this._inputData = data;
    this.emailBody = data;

  }

  save() {
    console.log('here is saved data', this.emailBody);
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
    console.log(data);
    this.close(true);
  }

  saveData(data) {
    console.log(data);
    this.emailBody = data;
  }

  sendEmail() {
    if (this.emailIdList.length == 0) {
      this.eventService.openSnackBar('Please enter to email');
      return;
    }
    if (this._inputData && this._inputData.documentList.length > 0) {
    } else {
      this.eventService.openSnackBar('Please select a document to send email.');
      return;
    }
    if (this._inputData.templateType == 3) {

      const inviteeList = [];
      this.emailIdList.forEach(singleEmail => {
        inviteeList.push({
          name: this._inputData.clientName ? this._inputData.clientName : singleEmail.emailAddress,
          email: singleEmail.emailAddress,
          webhook: {
            success: 'http://dev.ifanow.in:8080/futurewise/api/v1/1/subscription/invoice/esignSuccessResponse/post',
            failure: 'http://dev.ifanow.in:8080/futurewise/api/v1/1/subscription/invoice/esignSuccessResponse/post1',
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

      this.subscription.documentEsignRequest(emailRequestData).subscribe(
        data => this.getResponseData(data)
      );
      console.log('send email complete JSON : ', JSON.stringify(emailRequestData));
    } else {

      const emailRequestData = {
        messageBody: this.emailBody,
        emailSubject: this.subject,
        fromEmail: this.emailData.fromEmail,
        toEmail: this.emailIdList,
        documentList: this._inputData.documentList,
        document_id: this._inputData.documentList[0].id,
      };
      this.subscription.sendDocumentViaEmailInPdfFormat(emailRequestData).subscribe(
        data => this.getResponseData(data)
      );
    }
  }

  removeEmailId(index) {
    // const index = this.emailIdList.indexOf(singleEmail);

    // if (index >= 0) {
    this.emailIdList.splice(index, 1);
    // }
  }

  onEmailIdEntryKeyPress(event) {
    const inputChar = event.key;
    if (inputChar == ',') {
      event.preventDefault();
      const emailId = this._inputData.clientData.userEmailId;
      this.emailIdList.push({ emailAddress: emailId });
      this._inputData.clientData.userEmailId = '';
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if (value && value.length > 0) {
      if (this.validatorType.EMAIL.test(value)) {
        this.emailIdList.push({ emailAddress: value });
      } else {
        this.eventService.openSnackBar('Enter valid email address');
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
}
