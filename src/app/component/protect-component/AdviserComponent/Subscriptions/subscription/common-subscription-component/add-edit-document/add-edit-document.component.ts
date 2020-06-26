import { Component, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from '../../../../../../../services/util.service';
import { EventService } from '../../../../../../../Data-service/event.service';
import { SubscriptionUpperSliderComponent } from '../upper-slider/subscription-upper-slider.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-add-edit-document',
  templateUrl: './add-edit-document.component.html',
  styleUrls: ['./add-edit-document.component.scss']
})
export class AddEditDocumentComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & PROCEED',
    buttonColor: 'primary',
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
  }
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  advisorId;

  blankOverview: any;
  // blankDocumentProperties;
  selectedOption = '3';
  isDocType;
  isDocName;
  _inputData;
  @Input() fragmentData;
  @Input() documentType;
  @Output() changeDocumentData = new EventEmitter();
  addTemplate: any;
  blankDocumentProperties: FormGroup;
  @Input()
  set data(inputData) {
    // this._inputData = inputData.value;
    this.documentType;
    if (inputData.template) {
      this.addTemplate = inputData.template;
      inputData['addFlag'] = true;
      this._inputData = inputData;
      this.setFormData({ documentTypeId: inputData.value });
    }
    else {
      inputData['addFlag'] = false;
      this._inputData = inputData;
      this.setFormData(inputData);
    }
    // obj.outstandingCheck.toString();
    // availableAt
    // this.selectedOption = '1';
    // this.selectedOption = inputData ? (inputData.public ? (inputData.public === 1 ? '3' : inputData.mappingType) : '3') : '1';
  }

  get inputData() {
    return this._inputData;
  }

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder,
    private subService: SubscriptionService, private eventService: EventService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.setValidation(false);
  }

  setFormData(inputData) {
    this.blankDocumentProperties = this.fb.group({
      docType: [(inputData.documentTypeId) ? String(inputData.documentTypeId) : '', [Validators.required]],
      docName: [inputData.description ? inputData.description : '', [Validators.required]],
      docAvailability: [(inputData.availableAt) ? String(inputData.availableAt) : '1', [Validators.required]],
      selectPlan: []
    });
    // let data = (inputData.documentTypeId) ? inputData.documentTypeId.toString() : inputData.value;
    // this.blankDocumentProperties.controls.docType.setValue(data);
    // if (inputData == "") {

    // }
    // (inputData.documentTypeId) ? this.blankDocumentProperties.controls.docType.enable() : (inputData == "") ? this.blankDocumentProperties.controls.docType.enable() : this.blankDocumentProperties.controls.docType.disable();
    // this.selectedOption = inputData.documentTypeId;
    // this.blankDocumentProperties.controls.docName.setValue(inputData.name);
    // this.blankDocumentProperties.controls.docAvailability.setValue(data);
    // if (this.inputData.add) {
    (this._inputData.addFlag == false) ? this.blankDocumentProperties.controls.docType.disable() : '';
    (this.blankDocumentProperties.controls.docType.value == 9) ? this.blankDocumentProperties.controls.docType.disable() : '';
    // }
  }

  setValidation(flag) {
    this.isDocName = flag;
    // this.is
  }

  getFormControl() {
    return this.blankDocumentProperties.controls;
  }

  Close(state) {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  selectDocument(value) {
    this.selectedOption = value;
    this.blankDocumentProperties.patchValue({
      docAvailability: value
    });
  }

  saveDocuments() {
    if (this.blankDocumentProperties.invalid) {
      // for (let element in this.blankDocumentProperties.controls) {
      //   if (this.blankDocumentProperties.get(element).invalid) {
      // this.inputs.find(input => !input.ngControl.valid).focus();
      this.blankDocumentProperties.markAllAsTouched();
      //   }
      // }
    } else {
      this.barButtonOptions.active = true;
      if (this._inputData.addFlag) {
        const docText = UtilService.getDocumentTemplates(this.blankDocumentProperties.controls.docType.value);
        const obj = {
          advisorId: this.advisorId,
          name: this.blankDocumentProperties.controls.docName.value,
          // documentTypeId: parseInt(this.blankDocumentProperties.controls.docType.value),
          documentTypeId: this.blankDocumentProperties.controls.docType.value.toString(),
          docText: this.addTemplate,
          description: this.blankDocumentProperties.controls.docName.value,
          public: true,
          quotation: this.blankDocumentProperties.controls.docType.value == 7 ? true : false,
          availableAt: this.blankDocumentProperties.controls.docAvailability.value,
          mappingId: this.blankDocumentProperties.controls.docType.value == '3' ? 5 : 0,
          docType: this.blankDocumentProperties.controls.docType.value
        };

        this.subService.addSettingDocument(obj).subscribe(
          data => {
            this.subInjectService.changeNewRightSliderState({ state: 'close', data: { documentData: data } });
            // this.sendDataToParentUpperFrag(data);
            this.barButtonOptions.active = false;
          },
          err => {
            this.barButtonOptions.active = false;
          }
        );
      } else {
        const obj = {
          advisorId: this.advisorId,
          availableAt: this.blankDocumentProperties.controls.docAvailability.value,
          description: this.blankDocumentProperties.controls.docName.value,
          docText: this._inputData.docText,
          documentRepositoryId: this._inputData.documentRepositoryId, // pass here advisor id for Invoice advisor
          documentTypeId: this.blankDocumentProperties.controls.docType.value.toString(),
          name: this.blankDocumentProperties.controls.docName.value,
        };
        this.subService.updateDocumentData(obj).subscribe(
          data => {
            obj['id'] = data;
            this.subInjectService.changeNewRightSliderState({ state: 'close', data: { documentData: obj } });
            this.sendDataToParentUpperFrag(data);
            this.barButtonOptions.active = false;
          },
          err => {
            this.barButtonOptions.active = false;

          }
        );
      }
    }

    // }else{
    //   const obj = {
    //     advisorId: this.advisorId,
    //     availableAt: this._inputData.availableAt,
    //     description: this._inputData.description,
    //     docText: this._inputData.docText,
    //     documentRepositoryId: this._inputData.documentRepositoryId, // pass here advisor id for Invoice advisor
    //     documentTypeId:this._inputData.documentTypeId,
    //     name: this._inputData.name,
    //   };
    //   this.subService.updateDocumentData(obj).subscribe(
    //     data => 
    //     {
    //       this.subInjectService.changeNewRightSliderState({ state: 'close', data });
    //       this.sendDataToParentUpperFrag(data)
    //     }
    //   );
    // }

  }

  sendDataToParentUpperFrag(data) {
    // this.subInjectService.changeNewRightSliderState({ state: 'close', documentData: data, flag: 'documents' });
    // if (!this.fragmentData.data) {
    //   this.fragmentData.data = {};
    // }
    // this.fragmentData.data.documentData = data;

    // const fragmentData = {
    //   flag: 'openUpper',
    //   data: { documentData: data, flag: 'documents' },
    //   direction: 'top',
    //   id: 1,
    //   componentName: SubscriptionUpperSliderComponent,

    //   state: 'open'

    // };

    /*this.eventService.upperSliderDataObs.subscribe((upperData) => {
    });*/
    // const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
    //   upperSliderData => {
    //     if (UtilService.isDialogClose(upperSliderData)) {
    //       // this.getClientSubscriptionList();
    //       subscription.unsubscribe();
    //     }
    //   }
    // );
  }


}
