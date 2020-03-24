import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-client-bank',
  templateUrl: './client-bank.component.html',
  styleUrls: ['./client-bank.component.scss']
})
export class ClientBankComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) {
  }

  bankForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();

  ngOnInit() {
    this.bankForm = this.fb.group({
      ifscCode: [, [Validators.required]],
      bankName: [, [Validators.required]],
      micrName: [, [Validators.required]],
      accNumber: [, [Validators.required]],
      accType: ['1', [Validators.required]],
      branchName: [, [Validators.required]],
      branchCountry: [, [Validators.required]],
      branchPinCode: [, [Validators.required]],
      branchAddressLine1: [, [Validators.required]],
      branchAddressLine2: [, [Validators.required]],
      branchCity: [, [Validators.required]],
      branchState: [, [Validators.required]]
    })
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
