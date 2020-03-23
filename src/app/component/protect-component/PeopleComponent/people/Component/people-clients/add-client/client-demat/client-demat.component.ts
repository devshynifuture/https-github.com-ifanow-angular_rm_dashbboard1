import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-client-demat',
  templateUrl: './client-demat.component.html',
  styleUrls: ['./client-demat.component.scss']
})
export class ClientDematComponent implements OnInit {

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  dematForm;
  @Output() tabChange = new EventEmitter();
  ngOnInit() {
    this.dematForm = this.fb.group({
      modeOfHolding: [],
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
