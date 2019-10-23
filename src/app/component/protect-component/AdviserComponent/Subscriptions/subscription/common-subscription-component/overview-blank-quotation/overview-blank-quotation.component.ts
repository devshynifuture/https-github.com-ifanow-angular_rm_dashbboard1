import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../subscription-inject.service';
import {FormBuilder} from '@angular/forms';
import {SubscriptionService} from '../../../subscription.service';
import {AuthService} from "../../../../../../../auth-service/authService";

@Component({
  selector: 'app-overview-blank-quotation',
  templateUrl: './overview-blank-quotation.component.html',
  styleUrls: ['./overview-blank-quotation.component.scss']
})
export class OverviewBlankQuotationComponent implements OnInit {

  advisorId;

  @Input() blankOverview: any;
  blankDocumentProperties;
  selectedOption;

  constructor(public subInjectService: SubscriptionInject, private fb: FormBuilder, private subService: SubscriptionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.createForm();
  }

  createForm() {
    this.blankDocumentProperties = this.fb.group({
      docType: [''],
      docName: [''],
      docAvailability: [],
      selectPlan: []
    });
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

      // "advisorId": 55,
      name: this.blankDocumentProperties.controls.docName.value,
      documentTypeId: parseInt(this.blankDocumentProperties.controls.docType.value),
      docText: 'docText',
      description: this.blankDocumentProperties.controls.docName.value,
      public: true,
      quotation: true,
      mappedType: 1,
      getMappingId: 5

    };
    this.subService.addSettingDocument(obj).subscribe(
      data => console.log(data)
    );
  }
}
