import { UtilService } from './../../../../../../../../services/util.service';
import { SubscriptionInject } from './../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-suggest-advice',
  templateUrl: './suggest-advice.component.html',
  styleUrls: ['./suggest-advice.component.scss']
})
export class SuggestAdviceComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private subscriptionInject: SubscriptionInject,
    private utilService: UtilService
  ) { }
  @ViewChild('stepper', { static: true }) stepper;

  isLinear = false;
  adviceForm: FormGroup = this.fb.group({
    "header": [, Validators.required],
    "rationale": [, Validators.required],
    "status": [, Validators.required],
    "givenOnDate": [, Validators.required],
    "implementDate": [, Validators.required],
    "withdrawalAmt": [, Validators.required],
    "consentOption": [, Validators.required]
  });

  // firstFormGroup: FormGroup = this.fb.group({
  //   firstCtrl: ['', Validators.required]
  // });

  // secondFormGroup: FormGroup = this.fb.group({
  //   secondCtrl: ['', Validators.required]
  // });

  ngOnInit() { }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({ state: 'close' });
  }

  addOrNextStep() {
    if (this.utilService.formValidations(this.adviceForm)) {
      this.stepper.next();
    }
  }

}
