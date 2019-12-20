import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {SubscriptionService} from '../../../subscription.service';

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
  dataSub: any;
  emailBody: any;
  subject;
  doc: any;
  docObj: any[];

  constructor(public eventService: EventService, public subInjectService: SubscriptionInject, public subscription: SubscriptionService) {
    // this.dataSub = this.subInjectService.singleProfileData.subscribe(
    //   data => this.getcommanFroalaData(data)
    // );
  }

  @Input() emailSend;
  @Input() emailSendfooter;
  @Input() emailDocumentSend;
  @Input() emailDocument;
  @Output() valueChange = new EventEmitter();
  @Input() quotationData;
  _inputData;
  emailData;
  // @Input()
  // set data(data) {
  //   this._inputData = data;
  //   this._inputData = {
  //     advisorId: 2808,
  //     clientData: {
  //       id: data.clientData.id,
  //       userEmailId: data.clientData.userEmailId
  //     },
  //     documentList: [{id: data.documentList.id, documentName: data.documentName}],
  //     templateType: data.templateType
  //   };
  //   this.getEmailTemplateFilterData();
  // }
  // get data() {
  //   return this._inputData;
  // }
  @Input() set inputData(inputData) {
    let obj = []
    this.doc = inputData.documentList;
    if (inputData.isInv == true) {
      this.doc.forEach(element => {
        if (element) {
          let obj1 = {
            id: element.id,
            documentName: element.invoiceNumber
          }
          obj.push(obj1)
        }
      });
    } else {
      this.doc.forEach(element => {
        if (element) {
          let obj1 = {
            id: element.id,
            documentName: element.documentName
          }
          obj.push(obj1)
        }
      });
    }

    this.docObj = obj;
    this._inputData = inputData;
    this._inputData = {
      advisorId: 2808,
      clientData: {
        id: inputData.clientData.id,
        userEmailId: inputData.clientData.userEmailId
      },
      // documentList: [{id: inputData.documentList.id, documentName: inputData.documentList.documentName}],
      documentList: obj,
      templateType: inputData.templateType
    };
    console.log("dsfgsdggggggggg", this.docObj)
    console.log('EmailOnlyComponent inputData : ', inputData);
    this.getEmailTemplateFilterData();
  }

  get inputData() {
    return this._inputData;
  }

  config = {
    charCounterCount: false
  };

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

  getEmailTemplateFilterData() {

    const data = {
      advisorId: this._inputData.advisorId,
      clientId: this._inputData.clientData.id,
      templateType: this._inputData.templateType
    };
    this.subscription.getEmailTemplateFilterData(data).subscribe(responseData => {
      this.emailData = responseData;
      this.subject = this.emailData.subject;
      this.emailBody = this.emailData.body;
    }, error => {
      this.eventService.openSnackBar(error, 'dismiss', () => {
        console.log('dismiss was clicked');
      });
    });
  }

  // getEmailTemplateFilterDataforEdit() {

  //   const data = {
  //     advisorId: 2828,
  //     clientId: 2978,
  //     templateType:2
  //   };
  //   this.subscription.getEmailTemplateFilterData(data).subscribe(responseData => {
  //     this.emailData = responseData;
  //     this.subject = this.emailData.subject;
  //     this.emailBody = this.emailData.body;
  //   }, error => {
  //     this.eventService.openSnackBar(error, 'dismiss', () => {
  //       console.log('dismiss was clicked');
  //     });
  //   });
  // }
  close() {
    this.subInjectService.changeUpperRightSliderState({state: 'close'});
    this.subInjectService.changeNewRightSliderState({state: 'close'});

    // this.valueChange.emit(this.emailSend);
  }

  remove(item) {
    this.docObj.splice(item, 1);
    // this.callFilter();

  }

  getEmailTemplate() {
    const obj = {
      advisorId: 2828,
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
    // this.subInjectService.addSingleProfile(data)
  }

  getcommanFroalaData(data) {
    console.log(data);
    this._inputData = data;
    // this.getEmailTemplateFilterDataforEdit();
    this.emailBody = data;

  }

  /*

    saveData(data) {
      console.log(data);
      this.storeData.documentText = data;
    }
  */

  save() {
    console.log('here is saved data', this.emailBody);
    this.updateData(this.emailBody);
    this.close();
  }

  updateData(data) {
    const obj = {
      id: data.documentRepositoryId, // pass here advisor id for Invoice advisor
      docText: data.documentText
    };
    // this.subscription.updateQuotationData(obj).subscribe(
    //   data => this.getResponseData(data)
    // );

    this.subscription.updateDocumentData(obj).subscribe(
      data => this.getResponseData(data)
    );
  }

  getResponseData(data) {
    console.log(data);
  }

  saveData(data) {
    console.log(data);
    this.emailBody = data;
  }

  sendEmail() {
    const emailRequestData = {
      body: this.emailBody,
      subject: this.subject,
      fromEmail: this.emailData.fromEmail,
      toEmail: [{emailId: this._inputData.clientData.userEmailId, sendType: 'to'}],
      documentList: this._inputData.documentList
    };
    console.log('send email complete JSON : ', JSON.stringify(emailRequestData));
  }
}
