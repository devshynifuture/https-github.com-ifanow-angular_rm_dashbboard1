import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
      mobileNo: [],
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
  }
  saveNext() {
    this.tabChange.emit(1);
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
