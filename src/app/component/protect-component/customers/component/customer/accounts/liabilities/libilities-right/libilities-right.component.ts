import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-libilities-right',
  templateUrl: './libilities-right.component.html',
  styleUrls: ['./libilities-right.component.scss']
})
export class LibilitiesRightComponent implements OnInit {

  constructor(private subinject: SubscriptionInject) { }

  ngOnInit() {
  }
  closeNav(state) {
    this.subinject.rightSideData(state);
  }
}
