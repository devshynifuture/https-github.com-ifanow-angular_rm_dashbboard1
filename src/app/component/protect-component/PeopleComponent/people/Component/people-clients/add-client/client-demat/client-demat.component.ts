import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-client-demat',
  templateUrl: './client-demat.component.html',
  styleUrls: ['./client-demat.component.scss']
})
export class ClientDematComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  dematForm;
  validatorType = ValidatorType;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.dematForm = this.fb.group({
      modeOfHolding: ['1'],
      holderNameList: new FormArray([]),
      depositoryPartName: [],
      depositoryPartId: [],
      clientId: [],
      brekerName: [],
      brokerAddress: [],
      brokerPhone: [],
      linkedBankAccount: [],
      powerOfAttName: [],
      powerOfAttMasId: []
    })
    this.addHolders();
  }
  get getDematForm() { return this.dematForm.controls };
  get holderNameList() { return this.getDematForm.holderNameList as FormArray };
  addHolders() {
    if (this.holderNameList.length == 3) {
      return;
    }
    this.holderNameList.push(this.fb.group({
      name: ['', [Validators.required]]
    }));
  }
  removeHolders(index) {
    this.dematForm.controls.transactionFormList.removeAt(index)
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
