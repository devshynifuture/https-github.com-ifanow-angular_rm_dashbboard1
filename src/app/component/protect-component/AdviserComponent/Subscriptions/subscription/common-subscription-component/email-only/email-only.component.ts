import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {SubscriptionService} from '../../../subscription.service';

@Component({
  selector: 'app-email-only',
  // templateUrl: './email-only.component.html',
  templateUrl: './invoice-pdf.html',

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
  storeData: any;

  constructor(public eventService: EventService, public subInjectService: SubscriptionInject, public subscription: SubscriptionService) {
    this.dataSub = this.subInjectService.singleProfileData.subscribe(
      data => this.getcommanFroalaData(data)
    );
  }

  @Input() emailSend;
  @Input() emailSendfooter;
  @Input() emailDocumentSend;
  @Input() emailDocument;
  @Output() valueChange = new EventEmitter();
  @Input() quotationData;

  _inputData;

  @Input() set inputData(inputData) {
    this._inputData = inputData;
    console.log('EmailOnlyComponent inputData : ', inputData);

  }

  get inputData() {
    return this._inputData;
  }

  config = {
    charCounterCount: false
  };

  ngOnInit() {
    this.getEmailTemplate();
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

  Close(value) {
    this.valueChange.emit(this.emailSend);
  }
  getEmailTemplate(){
    const obj = {
      advisorId: 2828,
      templateId:1
    };
    this.subscription.getTemplate(obj).subscribe(
      data => this.getTemplateData(data)
    );
  }
  getTemplateData(data){
    console.log(data)
  }
  openEmailQuot(value, state) {
    this.eventService.sliderData(value);
    this.subInjectService.rightSliderData(state);
    // this.subInjectService.addSingleProfile(data)
  }

  getcommanFroalaData(data) {
    console.log(data);
    this.storeData = data;
  }

  /*

    saveData(data) {
      console.log(data);
      this.storeData.documentText = data;
    }
  */

  save() {
    console.log('here is saved data', this.storeData);
    this.updateData(this.storeData);
    this.Close('close');
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
    this.storeData = data;
  }
}
