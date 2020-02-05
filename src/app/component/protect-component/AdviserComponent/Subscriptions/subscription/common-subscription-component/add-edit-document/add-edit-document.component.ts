import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from '../../../../../../../auth-service/authService';
import { UtilService } from '../../../../../../../services/util.service';
import { EventService } from '../../../../../../../Data-service/event.service';
import { SubscriptionUpperSliderComponent } from '../upper-slider/subscription-upper-slider.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

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
    docAvailability: [1, [Validators.required]],
    selectPlan: []
  });
  @Input() documentType;
  @Output() changeDocumentData = new EventEmitter();
  @Input()
  set data(inputData) {
    this._inputData = inputData;
    this.documentType;
    // obj.outstandingCheck.toString();
    // availableAt
    this.selectedOption = '1';
    // this.selectedOption = inputData ? (inputData.public ? (inputData.public === 1 ? '3' : inputData.mappingType) : '3') : '1';
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
    let data = (inputData.documentTypeId) ? inputData.documentTypeId.toString() : inputData;
    this.blankDocumentProperties.controls.docType.setValue(data);
    if (inputData == "") {

    }
    (inputData.documentTypeId) ? this.blankDocumentProperties.controls.docType.enable() : (inputData == "") ? this.blankDocumentProperties.controls.docType.enable() : this.blankDocumentProperties.controls.docType.disable();

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
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  selectDocument(value) {
    this.selectedOption = value;
    this.blankDocumentProperties.patchValue({
      docAvailability: value
    });
  }

  saveDocuments() {
    if(this.blankDocumentProperties.invalid){
      this.blankDocumentProperties.get('docType').markAsTouched();
      this.blankDocumentProperties.get('docName').markAsTouched();
    }
     else {
      this.barButtonOptions.active = true;
      if (this._inputData.documentRepositoryId == undefined) {
        const obj = {
          advisorId: this.advisorId,
          name: this.blankDocumentProperties.controls.docName.value,
          // documentTypeId: parseInt(this.blankDocumentProperties.controls.docType.value),
          documentTypeId: this.blankDocumentProperties.controls.docType.value.toString(),
          docText: 'docText',
          description: this.blankDocumentProperties.controls.docName.value,
          public: true,
          quotation: this._inputData.docType == '3' ? true : false,
          availableAt: this.selectedOption ? parseInt(this.selectedOption) : 0,
          mappingId: this._inputData.docType == '3' ? 5 : 0,
          docType: this.blankDocumentProperties.controls.docType.value

        };
        // console.log(obj);
        // console.log(obj);

        this.subService.addSettingDocument(obj).subscribe(
          data => {
            console.log(data);
            this.subInjectService.changeNewRightSliderState({ state: 'close', data: { documentData: data } });
            // this.sendDataToParentUpperFrag(data);
            this.barButtonOptions.active = false;
          },
          err=>{
            this.barButtonOptions.active = false;
            console.log(err, "error changeNewRightSliderState");
          }
        );
      } else {
        const obj = {
          advisorId: this._inputData.advisorId,
          availableAt: this.selectedOption ? parseInt(this.selectedOption) : 0,
          description: this.blankDocumentProperties.controls.docName.value,
          docText: this._inputData.docText,
          documentRepositoryId: this._inputData.documentRepositoryId, // pass here advisor id for Invoice advisor
          documentTypeId: this.blankDocumentProperties.controls.docType.value.toString(),
          name: this.blankDocumentProperties.controls.docName.value,
        };
        this.subService.updateDocumentData(obj).subscribe(
          data => {
            console.log(data);
            obj['id'] = data;
            this.subInjectService.changeNewRightSliderState({ state: 'close', data: { documentData: obj } });
            this.sendDataToParentUpperFrag(data);
            this.barButtonOptions.active = false;
          },
          err =>{
            this.barButtonOptions.active = false;
            console.log(err, "error changeNewRightSliderState");
            
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
