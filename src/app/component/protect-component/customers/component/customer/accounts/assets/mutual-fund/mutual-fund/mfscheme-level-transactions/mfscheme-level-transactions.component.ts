import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-mfscheme-level-transactions',
  templateUrl: './mfscheme-level-transactions.component.html',
  styleUrls: ['./mfscheme-level-transactions.component.scss']
})
export class MFSchemeLevelTransactionsComponent implements OnInit {

  constructor(public subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
