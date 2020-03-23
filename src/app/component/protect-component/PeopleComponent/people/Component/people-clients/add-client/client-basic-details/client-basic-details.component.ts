import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-client-basic-details',
  templateUrl: './client-basic-details.component.html',
  styleUrls: ['./client-basic-details.component.scss']
})
export class ClientBasicDetailsComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  basicDetails;
  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();
  validatorType = ValidatorType
  ngOnInit() {
    this.createForm();
  }
  @Input() set data(data) {
  }
  createForm() {
    this.basicDetails = this.fb.group({
      invCategory: [, [Validators.required]],
      invTaxStatus: [, [Validators.required]],
      fullName: [, [Validators.required]],
      email: [],
      mobileNo: new FormArray([]),
      pan: [],
      username: [, [Validators.required]],
      dobAsPerRecord: [],
      dobActual: [],
      gender: ['1', [Validators.required]],
      leadSource: [],
      leaadStatus: [],
      leadRating: [],
      leadOwner: [],
      clientOwner: [, [Validators.required]],
      role: [, [Validators.required]],
    })
    this.addNumber();
  }
  get getBasicDetails() { return this.basicDetails.controls; }
  get getMobileNumList() { return this.getBasicDetails.mobileNo as FormArray; }
  removeNumber(index) {
    (index == 0) ? '' : this.basicDetails.controls.mobileNo.removeAt(index)
  }
  addNumber() {
    this.getMobileNumList.push(this.fb.group({
      code: [, [Validators.required]],
      number: [, [Validators.required]]
    }))
  }
  saveNext() {
    this.tabChange.emit(1);
  }
  saveClose() {
    this.close();
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
