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
  minorForm: any;
  nonIndividualForm: any;

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  basicDetails;
  @Input() fieldFlag;
  @Output() tabChange = new EventEmitter();
  validatorType = ValidatorType;
  invTypeCategory = '1';
  invTaxStatus = '1';
  ngOnInit() {
    this.createIndividualForm();
  }
  @Input() set data(data) {
  }
  createIndividualForm() {
    this.basicDetails = this.fb.group({
      fullName: [, [Validators.required]],
      email: [, [Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
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
  createMinorForm() {
    this.minorForm = this.fb.group({
      minorFullName: [],
      dobAsPerRecord: [],
      dobActual: [],
      gender: ['1'],
      gFullName: [],
      gDobAsPerRecord: [],
      gDobActual: [],
      gGender: ['1'],
      relationWithMinor: [],
      gEmail: [, [Validators.pattern(this.validatorType.EMAIL)]],
      mobileNo: [],
      pan: [],
      username: [],
      leadOwner: [],
      role: []
    })
  }
  createNonIndividualForm() {
    this.nonIndividualForm = this.fb.group({
      comName: [],
      dateOfIncorporation: [],
      comStatus: [],
      comEmail: [[Validators.pattern(this.validatorType.EMAIL)]],
      comPhone: [],
      comPan: [],
      comOccupation: [],
      username: [],
      leadOwner: [],
      role: []
    })
  }
  get getBasicDetails() { return this.basicDetails.controls; }
  get getMobileNumList() { return this.getBasicDetails.mobileNo as FormArray; }
  create
  removeNumber(index) {
    (index == 0) ? '' : this.basicDetails.controls.mobileNo.removeAt(index)
  }
  addNumber() {
    this.getMobileNumList.push(this.fb.group({
      code: [, [Validators.required]],
      number: [, [Validators.required]]
    }))
  }
  changeInvestorType(event) {
    this.invTypeCategory = event.value;
    (event.value == '1') ? this.createIndividualForm() : (event.value == '2') ? this.createMinorForm() : this.createNonIndividualForm();
  }
  changeTaxStatus(event) {
    this.invTaxStatus = event.value;
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
