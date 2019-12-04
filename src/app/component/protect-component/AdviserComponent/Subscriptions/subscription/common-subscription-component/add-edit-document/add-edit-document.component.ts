import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from '../../../../../../../auth-service/authService';
import {UtilService} from '../../../../../../../services/util.service';
import {EventService} from '../../../../../../../Data-service/event.service';

@Component({
  selector: 'app-add-edit-document',
  templateUrl: './add-edit-document.component.html',
  styleUrls: ['./add-edit-document.component.scss']
})
export class AddEditDocumentComponent implements OnInit {

  advisorId;

  blankOverview: any;
  // blankDocumentProperties;
  selectedOption = '3';
  isDocType;
  isDocName;
  _inputData;
  @Input() fragmentData;
  blankDocumentProperties = this.fb.group({
    docType: ['', [Validators.required]],
    docName: ['', [Validators.required]],
    docAvailability: [this.selectedOption, [Validators.required]],
    selectPlan: []
  });

  @Input()
  set inputData(inputData) {
    this._inputData = inputData;
    this.selectedOption = inputData ? (inputData.public ? (inputData.public === 1 ? '3' : inputData.mappingType) : '3') : '1';
    console.log('AddEditDocumentComponent inputData: ', inputData);
    this.setFormData(inputData);
  }

  get inputData() {
    return this._inputData;
  }

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
              private subService: SubscriptionService, private eventService: EventService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.createForm();
    this.setValidation(false);
  }

  setFormData(inputData) {
    this.blankDocumentProperties.controls.docType.setValue(inputData.docType);
    this.blankDocumentProperties.controls.docName.setValue(inputData.name);
    this.blankDocumentProperties.controls.docAvailability.setValue(this.selectedOption);

  }

  setValidation(flag) {
    this.isDocName = flag;
    // this.is
  }

  createForm() {

  }

  getFormControl() {
    return this.blankDocumentProperties.controls;
  }

  Close(state) {
    this.subInjectService.rightSliderData(state);
  }

  selectDocument(value) {
    this.selectedOption = value;
    this.blankDocumentProperties.patchValue({
      docAvailability: value
    });
  }

  saveDocuments() {

    const obj = {
      advisorId: this.advisorId,
      name: this.blankDocumentProperties.controls.docName.value,
      // documentTypeId: parseInt(this.blankDocumentProperties.controls.docType.value),
      documentTypeId:1,
      docText: 'docText',
      description: this.blankDocumentProperties.controls.docName.value,
      public: true,
      quotation: this._inputData.docType == '3' ? true : false,
      availableAt: this.selectedOption ? parseInt(this.selectedOption) : 0,
      mappingId: this._inputData.docType == '3' ? 5 : 0

    };
    // console.log(obj);
    // console.log(obj);
    this.subService.addSettingDocument(obj).subscribe(
      data => {
        console.log(data);
        this.subInjectService.changeUpperRightSliderState({state: 'close', data});
        this.sendDataToParentUpperFrag(data);
      }
    );
  }

  sendDataToParentUpperFrag(data) {
    if (!this.fragmentData.data) {
      this.fragmentData.data = {};
    }
    // this.fragmentData.data.documentData = data;

    const fragmentData = {
      flag: 'app-subscription-upper-slider',
      data: {documentData: data, flag: 'documents'},
      id: 1,
      state: 'open'
    };

    /*this.eventService.upperSliderDataObs.subscribe((upperData) => {
    });*/
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }
}
